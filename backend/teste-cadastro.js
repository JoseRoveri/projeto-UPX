const banco = require("./database");
const bcrypt = require("bcrypt");

const email = "teste@ecoenergia.test";

const usuarioExistente = banco.prepare(`
    SELECT id
    FROM usuarios
    WHERE email = ?
`).get(email);

if (usuarioExistente) {
    console.log("O usuário de teste já existe.");
} else {
    const senhaHash = bcrypt.hashSync("SenhaTeste123!", 10);

    const inserirUsuario = banco.prepare(`
        INSERT INTO usuarios (
            nome,
            email,
            senha_hash,
            tipo
        )
        VALUES (?, ?, ?, ?)
    `);

    const resultado = inserirUsuario.run(
        "Usuário Teste",
        email,
        senhaHash,
        "aluno"
    );

    console.log("Usuário cadastrado! ID:", resultado.lastInsertRowid);
}

banco.close();