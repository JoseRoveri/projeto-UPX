const banco = require("./database");
const bcrypt = require("bcrypt");

const emailDigitado = "teste@ecoenergia.test";
const senhaDigitada = "SenhaTeste123!";

// Procura o usuário pelo e-mail.
const usuario = banco.prepare(`
    SELECT id, nome, senha_hash
    FROM usuarios
    WHERE email = ?
`).get(emailDigitado);

if (!usuario) {
    console.log("E-mail ou senha incorretos.");
} else {
    // Confere a senha digitada com o hash salvo no banco.
    const senhaCorreta = bcrypt.compareSync(
        senhaDigitada,
        usuario.senha_hash
    );

    if (senhaCorreta) {
        console.log("Dados corretos! Usuário:", usuario.nome);
    } else {
        console.log("E-mail ou senha incorretos.");
    }
}

banco.close();