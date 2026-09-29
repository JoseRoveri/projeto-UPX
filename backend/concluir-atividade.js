const banco = require("./database");
const corrigirQuiz = require("./corrigir-quiz");

async function concluirAtividade(req, res) {
    res.set("Cache-Control", "no-store");

    const origem = req.get("origin");

    if (origem && origem !== "http://127.0.0.1:5500") {
        return res.status(403).json({
            mensagem: "Origem não permitida."
        });
    }

    const { atividadeId, respostas } = req.body || {};
    const correcao = corrigirQuiz(atividadeId, respostas);

    if (!correcao.valido) {
        return res.status(400).json({
            mensagem: correcao.mensagem
        });
    }

    // Identifica o usuário pela sessão de login.
    const usuarioId = req.usuario.id;

    let cliente;
    let descartarConexao = false;

    try {
        cliente = await banco.connect();

        await cliente.query("BEGIN");

        // Registra somente a primeira conclusão desse quiz.
        const registro = await cliente.query(`
            INSERT INTO public.atividades_concluidas (
                usuario_id,
                atividade_id,
                total_perguntas,
                acertos,
                xp_recebido
            )
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (usuario_id, atividade_id) DO NOTHING
            RETURNING id
        `, [
            usuarioId,
            correcao.atividadeId,
            correcao.totalPerguntas,
            correcao.acertos,
            correcao.xpCalculado
        ]);

        const primeiraConclusao = registro.rowCount === 1;

        const xpGanho = primeiraConclusao
            ? correcao.xpCalculado
            : 0;

        // Atualiza XP, liga, sequência e última atividade.
        const resultadoUsuario = await cliente.query(`
            UPDATE public.usuarios
            SET
                xp = xp + $2,

                liga = CASE
                    WHEN xp + $2 >= 3500 THEN 'Diamante'
                    WHEN xp + $2 >= 2500 THEN 'Platina'
                    WHEN xp + $2 >= 1500 THEN 'Ouro'
                    WHEN xp + $2 >= 500 THEN 'Prata'
                    ELSE 'Bronze'
                END,

                sequencia = CASE
                    -- Primeira atividade do usuário.
                    WHEN ultima_atividade IS NULL THEN 1

                    -- Já concluiu um quiz hoje.
                    WHEN (
                        ultima_atividade AT TIME ZONE 'America/Sao_Paulo'
                    )::date = (
                        NOW() AT TIME ZONE 'America/Sao_Paulo'
                    )::date
                    THEN GREATEST(sequencia, 1)

                    -- Última atividade foi ontem.
                    WHEN (
                        ultima_atividade AT TIME ZONE 'America/Sao_Paulo'
                    )::date = (
                        NOW() AT TIME ZONE 'America/Sao_Paulo'
                    )::date - 1
                    THEN sequencia + 1

                    -- Houve um dia inteiro sem atividade.
                    ELSE 1
                END,

                ultima_atividade = NOW()
            WHERE id = $1
            RETURNING
                id, nome, email, tipo, xp, nivel, sequencia, liga,
                ultima_atividade AS "ultimaAtividade"
        `, [usuarioId, xpGanho]);

        const usuario = resultadoUsuario.rows[0];

        if (!usuario) {
            throw new Error(
                "Usuário não encontrado ao salvar a atividade."
            );
        }

        await cliente.query("COMMIT");

        return res.json({
            mensagem: primeiraConclusao
                ? "Quiz concluído! Resultado salvo."
                : "Quiz concluído novamente. O XP já foi contabilizado.",
            primeiraConclusao,
            totalPerguntas: correcao.totalPerguntas,
            acertos: correcao.acertos,
            xpGanho,
            xpTotal: usuario.xp,
            sequencia: usuario.sequencia,
            ultimaAtividade: usuario.ultimaAtividade,
            usuario
        });
    } catch (erro) {
        if (cliente) {
            try {
                await cliente.query("ROLLBACK");
            } catch {
                descartarConexao = true;
            }
        }

        console.error("Erro ao concluir atividade:", erro.message);

        return res.status(500).json({
            mensagem: "Não foi possível salvar o resultado do quiz."
        });
    } finally {
        if (cliente) {
            cliente.release(descartarConexao);
        }
    }
}

module.exports = concluirAtividade;