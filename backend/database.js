const { Pool } = require("pg");
const path = require("node:path");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const banco = new Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    connectionTimeoutMillis: 5000
});

banco.on("error", (erro) => {
    console.error("Erro na conexão com PostgreSQL:", erro.message);
});

module.exports = banco;