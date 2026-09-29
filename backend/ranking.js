const banco = require("./database");

async function listarRanking(req, res) {
    res.set("Cache-Control", "no-store");

    try {
        const resultado = await banco.query(`
            SELECT id, nome, tipo, xp, nivel, liga
            FROM public.usuarios
            ORDER BY xp DESC, id ASC
        `);

        return res.json({
            jogadores: resultado.rows
        });
    } catch (erro) {
        console.error("Erro ao consultar o ranking:", erro.message);

        return res.status(500).json({
            mensagem: "Não foi possível carregar o ranking."
        });
    }
}

module.exports = listarRanking;