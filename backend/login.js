const bcrypt = require("bcrypt");
const { randomBytes, createHash } = require("node:crypto");
const banco = require("./database");

async function fazerLogin(req, res) {
    res.set("Cache-Control", "no-store");

    try {
        const origem = req.get("origin");

        const origemEsperada =
            `${req.protocol}://${req.get("host")}`;

        if (
            origem &&
            origem !== origemEsperada
        ) {
            return res.status(403).json({
                mensagem: "Acesso não permitido."
            });
        }

        const { email, senha } = req.body || {};

        if (
            typeof email !== "string" || !email.trim() ||
            typeof senha !== "string" || !senha ||
            Buffer.byteLength(senha, "utf8") > 72
        ) {
            return res.status(400).json({
                mensagem: "Informe um e-mail e uma senha válidos."
            });
        }

        // 1. Busca o usuário e calcula a sequência atual.
        const resultado = await banco.query(`
            SELECT
                u.id,
                u.nome,
                u.email,
                u.senha_hash,
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
                u.ultima_atividade

            FROM public.usuarios AS u
            WHERE LOWER(u.email) = $1
        `, [email.trim().toLowerCase()]);

        const usuario = resultado.rows[0];

        if (!usuario) {
            return res.status(401).json({
                mensagem: "E-mail ou senha incorretos."
            });
        }

        // 2. Confere a senha.
        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha_hash
        );

        if (!senhaCorreta) {
            return res.status(401).json({
                mensagem: "E-mail ou senha incorretos."
            });
        }

        // 3. Gera um código aleatório para a sessão.
        const token = randomBytes(32).toString("hex");

        const tokenHash = createHash("sha256")
            .update(token)
            .digest("hex");

        // 4. Salva a sessão com validade de um dia.
        const sessao = await banco.query(`
            INSERT INTO public.sessoes (
                usuario_id,
                token_hash,
                expira_em
            )
            VALUES ($1, $2, NOW() + INTERVAL '1 day')
            RETURNING expira_em
        `, [usuario.id, tokenHash]);

        // 5. Envia o código da sessão ao navegador.
        res.cookie("ecoSessao", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            expires: sessao.rows[0].expira_em,
            path: "/"
        });

        // 6. Retorna os dados do usuário.
        return res.json({
            mensagem: "Login realizado com sucesso!",
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                xp: usuario.xp,
                nivel: usuario.nivel,
                sequencia: usuario.sequencia,
                liga: usuario.liga,
                ultimaAtividade: usuario.ultima_atividade
            }
        });
    } catch (erro) {
        console.error("Erro ao fazer login:", erro.message);

        return res.status(500).json({
            mensagem: "Não foi possível realizar o login."
        });
    }
}

module.exports = fazerLogin;