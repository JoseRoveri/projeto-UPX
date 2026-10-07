"use strict";

const banco = require("./database");
const corrigirQuiz = require("./corrigir-quiz");
const corrigirBloco = require("./corrigir-bloco");
const trilhaFacil = require("./trilha-facil");

const blocos = trilhaFacil.modulos.flatMap(
    modulo => modulo.blocos
);

const idsBlocos = blocos.map(
    bloco => bloco.atividadeId
);

async function concluirAtividade(req, res) {
    res.set("Cache-Control", "no-store");

    const origem = req.get("origin");

    const origemEsperada =
        `${req.protocol}://${req.get("host")}`;

    if (
        origem &&
        origem !== origemEsperada
    ) {
        return res.status(403).json({
            mensagem: "Origem não permitida."
        });
    }

    const { atividadeId, respostas } = req.body || {};

    if (
        typeof atividadeId !== "string" ||
        !Array.isArray(respostas)
    ) {
        return res.status(400).json({
            mensagem: "Envie atividadeId e um array de respostas."
        });
    }

    const indice = idsBlocos.indexOf(atividadeId);
    const ehBloco = indice !== -1;

    const correcao = ehBloco
        ? corrigirBloco(atividadeId, respostas)
        : corrigirQuiz(atividadeId, respostas);

    if (!correcao.valido) {
        console.warn("Atividade recusada:", {
            atividadeId,
            quantidadeRespostas: respostas.length,
            mensagem: correcao.mensagem
        });

        return res.status(400).json({
            mensagem: correcao.mensagem
        });
    }

    // Nos blocos, exige pelo menos metade das respostas certas.
    const minimoAcertos = ehBloco
        ? Math.ceil(correcao.totalPerguntas / 2)
        : 0;

    const aprovado = correcao.acertos >= minimoAcertos;
    const usuarioId = req.usuario.id;

    let cliente;
    let emTransacao = false;
    let descartarConexao = false;

    try {
        cliente = await banco.connect();

        await cliente.query("BEGIN");
        emTransacao = true;

        // Processa uma conclusão por vez para esta conta.
        const conta = await cliente.query(`
            SELECT
                id,
                nome,
                email,
                tipo,
                xp,
                nivel,
                sequencia,
                liga,
                moedas,
                ultima_atividade AS "ultimaAtividade"
            FROM public.usuarios
            WHERE id = $1
            FOR UPDATE
        `, [usuarioId]);

        let usuario = conta.rows[0];

        if (!usuario) {
            throw new Error("Usuário não encontrado.");
        }

        const historico = await cliente.query(`
            SELECT
                atividade_id,
                total_perguntas,
                acertos,
                xp_recebido
            FROM public.atividades_concluidas
            WHERE usuario_id = $1
              AND atividade_id = ANY($2::text[])
        `, [
            usuarioId,
            ehBloco ? idsBlocos : [atividadeId]
        ]);

        const idsAprovados = new Set(
            historico.rows
                .filter(item =>
                    !ehBloco ||
                    (
                        Number(item.total_perguntas) > 0 &&
                        Number(item.acertos) * 2 >=
                        Number(item.total_perguntas)
                    )
                )
                .map(item => item.atividade_id)
        );

        const anterior = historico.rows.find(
            item => item.atividade_id === atividadeId
        );

        const jaConcluido = idsAprovados.has(atividadeId);

        // Impede pular blocos ainda não aprovados.
        if (ehBloco && !jaConcluido) {
            const pendente = blocos
                .slice(0, indice)
                .find(item =>
                    !idsAprovados.has(item.atividadeId)
                );

            if (pendente) {
                await cliente.query("ROLLBACK");
                emTransacao = false;

                return res.status(403).json({
                    mensagem:
                        "Acerte pelo menos 50% dos blocos anteriores para avançar.",
                    proximaAtividadeId: pendente.atividadeId
                });
            }
        }

        const primeiraConclusao = aprovado && !jaConcluido;

        // Uma revisão ruim não apaga uma aprovação anterior.
        const concluido = jaConcluido || aprovado;

        let xpGanho = 0;

        if (primeiraConclusao) {
            // Considera eventual XP recebido antes desta regra.
            const xpAnteriorAtividade = Number(
                anterior?.xp_recebido || 0
            );

            xpGanho = Math.max(
                0,
                correcao.xpCalculado - xpAnteriorAtividade
            );

            await cliente.query(`
                INSERT INTO public.atividades_concluidas (
                    usuario_id,
                    atividade_id,
                    total_perguntas,
                    acertos,
                    xp_recebido
                )
                VALUES ($1, $2, $3, $4, $5)

                ON CONFLICT (usuario_id, atividade_id)
                DO UPDATE SET
                    total_perguntas = EXCLUDED.total_perguntas,
                    acertos = EXCLUDED.acertos,
                    xp_recebido = EXCLUDED.xp_recebido
            `, [
                usuarioId,
                atividadeId,
                correcao.totalPerguntas,
                correcao.acertos,
                xpAnteriorAtividade + xpGanho
            ]);

            idsAprovados.add(atividadeId);
        }

        // =====================================================
        // RECOMPENSAS LIBERADAS
        // =====================================================

        const xpAntes = Number(usuario.xp) || 0;
        const xpDepois = xpAntes + xpGanho;

        let recompensasLiberadas = [];

        /*
            Quando o usuário ultrapassa um marco de XP,
            a recompensa é registrada como LIBERADA.
        
            As EcoMoedas NÃO entram na conta aqui.
        
            Como resgatada_em não é preenchida,
            ela permanece NULL até o usuário clicar
            em "Receber" na Minha Jornada.
        */

        if (primeiraConclusao && xpGanho > 0) {

            const recompensas = await cliente.query(`
        WITH inseridas AS (
            INSERT INTO public.recompensas_recebidas (
                usuario_id,
                recompensa_id
            )
            SELECT
                $1,
                recompensa.id
            FROM public.recompensas AS recompensa
            WHERE recompensa.xp_necessario > $2
              AND recompensa.xp_necessario <= $3

            ON CONFLICT (
                usuario_id,
                recompensa_id
            )
            DO NOTHING

            RETURNING recompensa_id
        )

        SELECT
            recompensa.id,
            recompensa.nome,
            recompensa.xp_necessario AS "xpNecessario",
            recompensa.moedas
        FROM public.recompensas AS recompensa
        INNER JOIN inseridas
            ON inseridas.recompensa_id = recompensa.id
        ORDER BY recompensa.xp_necessario
    `, [
                usuarioId,
                xpAntes,
                xpDepois
            ]);

            recompensasLiberadas = recompensas.rows.map(
                recompensa => ({
                    id: recompensa.id,
                    nome: recompensa.nome,
                    xpNecessario: Number(
                        recompensa.xpNecessario
                    ),
                    moedas: Number(recompensa.moedas)
                })
            );
        }

        // Uma tentativa reprovada de um bloco pendente
        // não altera XP, liga ou ofensiva.
        if (concluido) {
            const atualizacao = await cliente.query(`
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
                        WHEN ultima_atividade IS NULL THEN 1

                        WHEN (
                            ultima_atividade
                            AT TIME ZONE 'America/Sao_Paulo'
                        )::date = (
                            NOW()
                            AT TIME ZONE 'America/Sao_Paulo'
                        )::date
                        THEN GREATEST(sequencia, 1)

                        WHEN (
                            ultima_atividade
                            AT TIME ZONE 'America/Sao_Paulo'
                        )::date = (
                            NOW()
                            AT TIME ZONE 'America/Sao_Paulo'
                        )::date - 1
                        THEN sequencia + 1

                        ELSE 1
                    END,

                    ultima_atividade = NOW()

                WHERE id = $1

                RETURNING
                    id,
                    nome,
                    email,
                    tipo,
                    xp,
                    nivel,
                    sequencia,
                    liga,
                    moedas,
                    ultima_atividade AS "ultimaAtividade"
            `, [
                usuarioId,
                xpGanho
            ]);

            usuario = atualizacao.rows[0];

            if (!usuario) {
                throw new Error(
                    "Não foi possível atualizar o usuário."
                );
            }
        }

        const proximo = ehBloco && concluido
            ? blocos.find(item =>
                !idsAprovados.has(item.atividadeId)
            )
            : null;

        await cliente.query("COMMIT");
        emTransacao = false;

        return res.json({
            mensagem: !concluido
                ? `Você acertou ${correcao.acertos} de ${correcao.totalPerguntas}. Precisa de ${minimoAcertos} acertos para avançar. Tente novamente!`
                : primeiraConclusao
                    ? "Atividade aprovada! Progresso salvo."
                    : "Revisão concluída. Este bloco já estava aprovado e não concede novo XP.",

            atividadeId,
            aprovado,
            concluido,
            minimoAcertos,
            primeiraConclusao,

            totalPerguntas: correcao.totalPerguntas,
            acertos: correcao.acertos,
            erros:
                correcao.totalPerguntas -
                correcao.acertos,

            xpGanho,
            xpTotal: Number(usuario.xp),

            moedasGanhas: 0,
            moedasTotal: Number(usuario.moedas || 0),

            recompensasLiberadas,

            sequencia: usuario.sequencia,
            ultimaAtividade: usuario.ultimaAtividade,

            resultados: correcao.resultados || [],
            proximaAtividadeId:
                proximo?.atividadeId ?? null,

            usuario
        });
    } catch (erro) {
        if (cliente && emTransacao) {
            try {
                await cliente.query("ROLLBACK");
            } catch {
                descartarConexao = true;
            }
        }

        console.error(
            "Erro ao concluir atividade:",
            erro.message
        );

        return res.status(500).json({
            mensagem: "Não foi possível salvar o resultado."
        });
    } finally {
        if (cliente) {
            cliente.release(descartarConexao);
        }
    }
}

module.exports = concluirAtividade;