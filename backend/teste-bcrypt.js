const bcrypt = require("bcrypt");

const senha = "SenhaTeste123!";
const hash = bcrypt.hashSync(senha, 10);

console.log(
    "Senha correta aceita:",
    bcrypt.compareSync(senha, hash)
);

console.log(
    "Senha errada aceita:",
    bcrypt.compareSync("SenhaErrada!", hash)
);