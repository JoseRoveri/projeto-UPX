const banco = require("./database");
const trilha = require("./trilha-facil");

const blocos = trilha.modulos.flatMap(modulo => modulo.blocos);
const idsBlocos = blocos.map(bloco => bloco.atividadeId);

async function consultarPerfil(req, res) {
    res.set("Cache-Control", "no-store");

    try {
        const [conta, historico] = await Promise.all([
            banco.query(`
                SELECT
                    id,
                    nome,
                    email,
                    tipo,
                    xp,
                    nivel,
                    liga,

                    CASE
                        WHEN ultima_atividade IS NULL THEN 0

                        WHEN (
                            ultima_atividade AT TIME ZONE 'America/Sao_Paulo'
                        )::date < (
                            NOW() AT TIME ZONE 'America/Sao_Paulo'
                        )::date - 1
                        THEN 0

                        ELSE COALESCE(sequencia, 0)
                    END AS sequencia,

                    ultima_atividade AS "ultimaAtividade"

                FROM public.usuarios
                WHERE id = $1
            `, [req.usuario.id]),

            banco.query(`
                SELECT atividade_id
                FROM public.atividades_concluidas
                WHERE usuario_id = $1
                    AND atividade_id = ANY($2::text[])
                    AND total_perguntas > 0
                    AND acertos * 2 >= total_perguntas
            `, [req.usuario.id, idsBlocos])
        ]);

        if (!conta.rows[0]) {
            return res.status(401).json({
                mensagem: "Entre novamente na sua conta."
            });
        }

        const concluidos = new Set(
            historico.rows.map(item => item.atividade_id)
        );

        const modulosConcluidos = trilha.modulos.filter(modulo =>
            modulo.blocos.length > 0 &&
            modulo.blocos.every(bloco =>
                concluidos.has(bloco.atividadeId)
            )
        ).length;

        const blocosConcluidos = blocos.filter(bloco =>
            concluidos.has(bloco.atividadeId)
        ).length;

        return res.json({
            usuario: conta.rows[0],

            trilha: {
                nivel: trilha.nivel,
                nome: trilha.nome,
                totalBlocos: blocos.length,
                blocosConcluidos,
                totalModulos: trilha.modulos.length,
                modulosConcluidos
            }
        });
    } catch (erro) {
        console.error("Erro ao consultar perfil:", erro.message);

        return res.status(500).json({
            mensagem: "Não foi possível carregar seu perfil."
        });
    }
}

async function atualizarPerfil(req, res) {
    res.set("Cache-Control", "no-store");

    const origem = req.get("origin");

    if (origem && origem !== "http://127.0.0.1:5500") {
        return res.status(403).json({
            mensagem: "Origem não permitida."
        });
    }

    const nome = typeof req.body?.nome === "string"
        ? req.body.nome.trim().replace(/\s+/g, " ")
        : "";

    if (!nome || nome.length > 80) {
        return res.status(400).json({
            mensagem: "Informe um nome com até 80 caracteres."
        });
    }

    try {
        const resultado = await banco.query(`
            UPDATE public.usuarios
            SET nome = $2
            WHERE id = $1
            RETURNING nome
        `, [req.usuario.id, nome]);

        if (!resultado.rows[0]) {
            return res.status(401).json({
                mensagem: "Entre novamente na sua conta."
            });
        }

        return res.json({
            nome: resultado.rows[0].nome,
            mensagem: "Nome atualizado!"
        });
    } catch (erro) {
        console.error("Erro ao atualizar perfil:", erro.message);

        return res.status(500).json({
            mensagem: "Não foi possível salvar. Tente novamente."
        });
    }
}

module.exports = {
    consultarPerfil,
    atualizarPerfil
};