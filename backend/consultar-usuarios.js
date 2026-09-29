const banco = require("./database");

const usuarios = banco.prepare(`
    SELECT id, nome, email, tipo, xp, nivel
    FROM usuarios
`).all();

console.table(usuarios);

banco.close();