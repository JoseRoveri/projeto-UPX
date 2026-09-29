const { createHash } = require("node:crypto");
const banco = require("./database");

async function autenticar(req, res, next) {
    res.set("Cache-Control", "no-store");

    const token = req.cookies?.ecoSessao;

    if (
        typeof token !== "string" ||
        !/^[a-f0-9]{64}$/.test(token)
    ) {
        return res.status(401).json({
            mensagem: "Faça login para continuar."
        });
    }

    try {
        const tokenHash = createHash("sha256")
            .update(token)
            .digest("hex");

        const resultado = await banco.query(`
            SELECT
                u.id,
                u.nome,
                u.email,
                u.tipo,
                u.xp,
                u.nivel,

                CASE
                    WHEN (
                        u.ultima_atividade
                        AT TIME ZONE 'America/Sao_Paulo'
                    )::date IN (
                        (NOW() AT TIME ZONE 'America/Sao_Paulo')::date,
                        (NOW() AT TIME ZONE 'America/Sao_Paulo')::date - 1
                    )
                    THEN u.sequencia

                    ELSE 0
                END AS sequencia,

                u.liga,
                u.ultima_atividade AS "ultimaAtividade"

            FROM public.sessoes AS s
            JOIN public.usuarios AS u
                ON u.id = s.usuario_id

            WHERE s.token_hash = $1
              AND s.expira_em > NOW()
        `, [tokenHash]);

        const usuario = resultado.rows[0];

        if (!usuario) {
            return res.status(401).json({
                mensagem: "Sessão inválida ou expirada. Entre novamente."
            });
        }

        req.usuario = usuario;

        return next();
    } catch (erro) {
        console.error("Erro ao verificar sessão:", erro.message);

        return res.status(500).json({
            mensagem: "Não foi possível verificar sua sessão."
        });
    }
}

module.exports = autenticar;