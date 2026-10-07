const { createHash } = require("node:crypto");
const banco = require("./database");

async function fazerLogout(req, res) {
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

        // 1. Lê o cookie recebido do navegador.
        const token = req.cookies?.ecoSessao;

        if (
            typeof token === "string" &&
            /^[a-f0-9]{64}$/.test(token)
        ) {
            // 2. Calcula o hash da sessão.
            const tokenHash = createHash("sha256")
                .update(token)
                .digest("hex");

            // 3. Remove essa sessão do banco.
            await banco.query(`
                DELETE FROM public.sessoes
                WHERE token_hash = $1
            `, [tokenHash]);
        }

        // 4. Solicita a remoção do cookie no navegador.
        res.clearCookie("ecoSessao", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/"
        });

        return res.json({
            mensagem: "Logout realizado com sucesso!"
        });
    } catch (erro) {
        console.error("Erro ao fazer logout:", erro.message);

        return res.status(500).json({
            mensagem: "Não foi possível encerrar a sessão."
        });
    }
}

module.exports = fazerLogout;