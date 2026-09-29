const banco = require("./database");

async function testarConexao() {
    try {
        const resultado = await banco.query(`
            SELECT current_database() AS banco
        `);

        console.log(
            "Conectado ao banco:",
            resultado.rows[0].banco
        );
    } catch (erro) {
        console.error("Erro ao conectar:", erro.message);
        process.exitCode = 1;
    } finally {
        await banco.end();
    }
}

testarConexao();