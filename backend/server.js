// ========================================
// IMPORTAÇÕES
// ========================================

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

require("dotenv").config();

const pool = require("./database");

const app = express();


// ========================================
// CONFIGURAÇÕES
// ========================================

app.use(cors());
app.use(express.json());


// ========================================
// ATIVIDADES DO ECOENERGIA
// ========================================

// O frontend NÃO escolhe quanto XP recebe.
// O backend calcula de acordo com a atividade.

const atividades = {

    quiz_agua_energia_01: {
        nome: "Quiz Água & Energia",
        totalPerguntas: 10,
        xpPorAcerto: 10
    }

};


// ========================================
// FUNÇÃO AUXILIAR
// VERIFICAR SE A SEQUÊNCIA EXPIROU
// ========================================

// Regra:
//
// Se a última atividade foi há MAIS de 24 horas,
// a sequência volta para 0.
//
// Exemplo:
//
// Segunda 15:00 -> atividade
// Terça 15:01 -> já passaram 24h
// sequência = 0

async function verificarSequenciaExpirada(
    usuarioId,
    cliente = pool
) {

    const resultado =
        await cliente.query(
            `
            UPDATE usuarios

            SET sequencia = 0

            WHERE
                id = $1

                AND ultima_atividade
                    IS NOT NULL

                AND ultima_atividade <
                    NOW() - INTERVAL '24 hours'

                AND sequencia <> 0

            RETURNING
                id,
                nome,
                email,
                tipo,
                xp,
                nivel,
                sequencia,
                liga,
                ultima_atividade
            `,
            [
                usuarioId
            ]
        );


    // Se atualizou, a sequência expirou.
    if (resultado.rows.length > 0) {

        return resultado.rows[0];

    }


    // Caso contrário, apenas busca
    // os dados atuais do usuário.

    const usuario =
        await cliente.query(
            `
            SELECT
                id,
                nome,
                email,
                tipo,
                xp,
                nivel,
                sequencia,
                liga,
                ultima_atividade

            FROM usuarios

            WHERE id = $1
            `,
            [
                usuarioId
            ]
        );


    if (usuario.rows.length === 0) {
        return null;
    }


    return usuario.rows[0];

}


// ========================================
// ROTA PRINCIPAL
// ========================================

app.get("/", (req, res) => {

    res.json({
        mensagem:
            "EcoEnergia API funcionando!"
    });

});


// ========================================
// TESTE DO BANCO
// ========================================

app.get(
    "/teste-banco",
    async (req, res) => {

        try {

            const resultado =
                await pool.query(
                    "SELECT NOW() AS agora"
                );


            res.json({

                mensagem:
                    "Banco conectado!",

                horarioBanco:
                    resultado.rows[0].agora

            });

        } catch (erro) {

            console.error(
                "Erro no banco:",
                erro
            );


            res.status(500).json({
                mensagem:
                    "Erro ao conectar no banco."
            });

        }

    }
);


// ========================================
// CADASTRO
// ========================================

app.post(
    "/api/cadastro",
    async (req, res) => {

        try {

            const {
                nome,
                email,
                senha,
                tipo
            } = req.body;


            if (
                !nome ||
                !email ||
                !senha ||
                !tipo
            ) {

                return res
                    .status(400)
                    .json({

                        mensagem:
                            "Preencha todos os campos."

                    });

            }


            // ========================================
            // VERIFICAR E-MAIL
            // ========================================

            const usuarioExistente =
                await pool.query(
                    `
                    SELECT id
                    FROM usuarios
                    WHERE email = $1
                    `,
                    [
                        email
                    ]
                );


            if (
                usuarioExistente.rows.length > 0
            ) {

                return res
                    .status(409)
                    .json({

                        mensagem:
                            "Este e-mail já está cadastrado."

                    });

            }


            // ========================================
            // CRIPTOGRAFAR SENHA
            // ========================================

            const senhaHash =
                await bcrypt.hash(
                    senha,
                    10
                );


            // ========================================
            // CADASTRAR
            // ========================================

            const resultado =
                await pool.query(
                    `
                    INSERT INTO usuarios
                    (
                        nome,
                        email,
                        senha_hash,
                        tipo
                    )

                    VALUES
                    ($1, $2, $3, $4)

                    RETURNING
                        id,
                        nome,
                        email,
                        tipo,
                        xp,
                        nivel,
                        sequencia,
                        liga,
                        ultima_atividade,
                        criado_em
                    `,
                    [
                        nome,
                        email,
                        senhaHash,
                        tipo
                    ]
                );


            res
                .status(201)
                .json({

                    mensagem:
                        "Cadastro realizado com sucesso!",

                    usuario:
                        resultado.rows[0]

                });

        } catch (erro) {

            console.error(
                "Erro no cadastro:",
                erro
            );


            res
                .status(500)
                .json({

                    mensagem:
                        "Erro interno ao realizar cadastro."

                });

        }

    }
);


// ========================================
// LOGIN
// ========================================

app.post(
    "/api/login",
    async (req, res) => {

        try {

            const {
                email,
                senha
            } = req.body;


            if (
                !email ||
                !senha
            ) {

                return res
                    .status(400)
                    .json({

                        mensagem:
                            "Preencha o e-mail e a senha."

                    });

            }


            // ========================================
            // BUSCAR USUÁRIO
            // ========================================

            const resultado =
                await pool.query(
                    `
                    SELECT *
                    FROM usuarios
                    WHERE email = $1
                    `,
                    [
                        email
                    ]
                );


            if (
                resultado.rows.length === 0
            ) {

                return res
                    .status(401)
                    .json({

                        mensagem:
                            "E-mail ou senha incorretos."

                    });

            }


            const usuario =
                resultado.rows[0];


            // ========================================
            // VERIFICAR SENHA
            // ========================================

            const senhaCorreta =
                await bcrypt.compare(
                    senha,
                    usuario.senha_hash
                );


            if (!senhaCorreta) {

                return res
                    .status(401)
                    .json({

                        mensagem:
                            "E-mail ou senha incorretos."

                    });

            }


            // ========================================
            // VERIFICAR SE SEQUÊNCIA EXPIROU
            // ========================================

            const usuarioAtualizado =
                await verificarSequenciaExpirada(
                    usuario.id
                );


            // ========================================
            // LOGIN CORRETO
            // ========================================

            res.json({

                mensagem:
                    "Login realizado com sucesso!",

                usuario: {

                    id:
                        usuarioAtualizado.id,

                    nome:
                        usuarioAtualizado.nome,

                    email:
                        usuarioAtualizado.email,

                    tipo:
                        usuarioAtualizado.tipo,

                    xp:
                        usuarioAtualizado.xp,

                    nivel:
                        usuarioAtualizado.nivel,

                    sequencia:
                        usuarioAtualizado.sequencia,

                    ultimaAtividade:
                        usuarioAtualizado.ultima_atividade,

                    liga:
                        usuarioAtualizado.liga

                }

            });

        } catch (erro) {

            console.error(
                "Erro no login:",
                erro
            );


            res
                .status(500)
                .json({

                    mensagem:
                        "Erro interno ao realizar login."

                });

        }

    }
);


// ========================================
// STATUS DO USUÁRIO
// ========================================

// Essa rota será usada pelo frontend
// quando a página principal abrir.
//
// Assim o site pode descobrir se
// passaram 24 horas e mostrar:
//
// 🔥 0

app.get(
    "/api/usuario/:id/status",
    async (req, res) => {

        try {

            const usuarioId =
                req.params.id;


            const usuario =
                await verificarSequenciaExpirada(
                    usuarioId
                );


            if (!usuario) {

                return res
                    .status(404)
                    .json({

                        mensagem:
                            "Usuário não encontrado."

                    });

            }


            res.json({

                usuario: {

                    id:
                        usuario.id,

                    nome:
                        usuario.nome,

                    email:
                        usuario.email,

                    tipo:
                        usuario.tipo,

                    xp:
                        usuario.xp,

                    nivel:
                        usuario.nivel,

                    sequencia:
                        usuario.sequencia,

                    ultimaAtividade:
                        usuario.ultima_atividade,

                    liga:
                        usuario.liga

                }

            });

        } catch (erro) {

            console.error(
                "Erro ao buscar status:",
                erro
            );


            res
                .status(500)
                .json({

                    mensagem:
                        "Erro ao carregar usuário."

                });

        }

    }
);


// ========================================
// RANKING
// ========================================

app.get(
    "/api/ranking",
    async (req, res) => {

        try {

            // Aqui calculamos a sequência
            // considerando a regra das 24h.

            const resultado =
                await pool.query(
                    `
                    SELECT

                        id,

                        nome,

                        xp,

                        tipo,

                        CASE

                            WHEN
                                ultima_atividade
                                IS NOT NULL

                                AND ultima_atividade <
                                    NOW()
                                    - INTERVAL '24 hours'

                            THEN 0

                            ELSE sequencia

                        END AS sequencia

                    FROM usuarios

                    ORDER BY
                        xp DESC,
                        id ASC
                    `
                );


            res.json({
                jogadores:
                    resultado.rows
            });

        } catch (erro) {

            console.error(
                "Erro ao buscar ranking:",
                erro
            );


            res
                .status(500)
                .json({

                    mensagem:
                        "Erro ao carregar ranking."

                });

        }

    }
);


// ========================================
// CONCLUIR ATIVIDADE
// ========================================

app.post(
    "/api/atividade/concluir",
    async (req, res) => {

        const cliente =
            await pool.connect();


        try {

            const {
                usuarioId,
                atividadeId,
                acertos
            } = req.body;


            // ========================================
            // VALIDAR CAMPOS
            // ========================================

            if (
                !usuarioId ||
                !atividadeId ||
                acertos === undefined
            ) {

                return res
                    .status(400)
                    .json({

                        mensagem:
                            "Usuário, atividade e acertos são obrigatórios."

                    });

            }


            // ========================================
            // VERIFICAR ATIVIDADE
            // ========================================

            const atividade =
                atividades[
                    atividadeId
                ];


            if (!atividade) {

                return res
                    .status(400)
                    .json({

                        mensagem:
                            "Atividade inválida."

                    });

            }


            // ========================================
            // VALIDAR ACERTOS
            // ========================================

            const numeroAcertos =
                Number(
                    acertos
                );


            if (
                !Number.isInteger(
                    numeroAcertos
                ) ||

                numeroAcertos < 0 ||

                numeroAcertos >
                    atividade.totalPerguntas
            ) {

                return res
                    .status(400)
                    .json({

                        mensagem:
                            "Quantidade de acertos inválida."

                    });

            }


            // ========================================
            // INICIAR TRANSAÇÃO
            // ========================================

            await cliente.query(
                "BEGIN"
            );


            // ========================================
            // BUSCAR USUÁRIO
            // ========================================

            const resultadoUsuario =
                await cliente.query(
                    `
                    SELECT
                        id,
                        nome,
                        xp,
                        sequencia,
                        ultima_atividade

                    FROM usuarios

                    WHERE id = $1

                    FOR UPDATE
                    `,
                    [
                        usuarioId
                    ]
                );


            if (
                resultadoUsuario.rows.length ===
                0
            ) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res
                    .status(404)
                    .json({

                        mensagem:
                            "Usuário não encontrado."

                    });

            }


            // ========================================
            // VERIFICAR SE JÁ GANHOU XP
            // ========================================

            const conclusaoExistente =
                await cliente.query(
                    `
                    SELECT
                        id,
                        xp_recebido,
                        concluido_em

                    FROM atividades_concluidas

                    WHERE
                        usuario_id = $1
                        AND atividade_id = $2
                    `,
                    [
                        usuarioId,
                        atividadeId
                    ]
                );


            const primeiraConclusao =
                conclusaoExistente
                    .rows
                    .length === 0;


            // ========================================
            // CALCULAR XP
            // ========================================

            let xpGanho = 0;


            if (primeiraConclusao) {

                xpGanho =
                    numeroAcertos *
                    atividade.xpPorAcerto;

            }


            // ========================================
            // ATUALIZAR XP + SEQUÊNCIA
            // ========================================
            //
            // REGRA DAS 24 HORAS:
            //
            // Nunca fez atividade:
            // 🔥 1
            //
            // Passaram mais de 24h:
            // 🔥 começa novamente em 1
            //
            // Fez outra atividade no mesmo dia:
            // mantém a sequência
            //
            // Fez em outro dia,
            // mas ainda dentro das 24h:
            // 🔥 +1
            //
            // ultima_atividade passa a guardar
            // data E hora exatas.
            // ========================================

            const usuarioAtualizado =
                await cliente.query(
                    `
                    UPDATE usuarios

                    SET

                        xp =
                            xp + $1,

                        sequencia =

                            CASE

                                -- Primeira atividade
                                WHEN
                                    ultima_atividade
                                    IS NULL

                                THEN 1


                                -- Passaram mais de 24h
                                WHEN
                                    ultima_atividade <
                                    NOW()
                                    - INTERVAL '24 hours'

                                THEN 1


                                -- Já fez atividade
                                -- no mesmo dia
                                WHEN
                                    (
                                        ultima_atividade
                                        AT TIME ZONE
                                        'America/Sao_Paulo'
                                    )::date

                                    =

                                    (
                                        NOW()
                                        AT TIME ZONE
                                        'America/Sao_Paulo'
                                    )::date

                                THEN
                                    GREATEST(
                                        sequencia,
                                        1
                                    )


                                -- Outro dia,
                                -- mas dentro de 24h
                                ELSE
                                    GREATEST(
                                        sequencia,
                                        0
                                    ) + 1

                            END,

                        ultima_atividade =
                            NOW()

                    WHERE id = $2

                    RETURNING
                        id,
                        nome,
                        xp,
                        sequencia,
                        ultima_atividade
                    `,
                    [
                        xpGanho,
                        usuarioId
                    ]
                );


            // ========================================
            // REGISTRAR PRIMEIRA CONCLUSÃO
            // ========================================

            if (primeiraConclusao) {

                await cliente.query(
                    `
                    INSERT INTO
                        atividades_concluidas
                    (
                        usuario_id,
                        atividade_id,
                        xp_recebido
                    )

                    VALUES
                    ($1, $2, $3)
                    `,
                    [
                        usuarioId,
                        atividadeId,
                        xpGanho
                    ]
                );

            }


            // ========================================
            // FINALIZAR TRANSAÇÃO
            // ========================================

            await cliente.query(
                "COMMIT"
            );


            const usuario =
                usuarioAtualizado
                    .rows[0];


            // ========================================
            // RESPOSTA
            // ========================================

            res.json({

                mensagem:

                    primeiraConclusao

                        ? "Atividade concluída! XP recebido."

                        : "Atividade concluída novamente. O XP desta atividade já foi recebido.",


                primeiraConclusao:
                    primeiraConclusao,


                xpGanho:
                    xpGanho,


                xpTotal:
                    usuario.xp,


                sequencia:
                    usuario.sequencia,


                ultimaAtividade:
                    usuario.ultima_atividade,


                usuario:
                    usuario

            });

        } catch (erro) {

            try {

                await cliente.query(
                    "ROLLBACK"
                );

            } catch (
                erroRollback
            ) {

                console.error(
                    "Erro no rollback:",
                    erroRollback
                );

            }


            console.error(
                "Erro ao concluir atividade:",
                erro
            );


            res
                .status(500)
                .json({

                    mensagem:
                        "Erro ao concluir atividade."

                });

        } finally {

            cliente.release();

        }

    }
);


// ========================================
// ROTA ANTIGA DE XP
// ========================================
//
// Ainda vamos manter temporariamente.
//
// O quiz novo já NÃO usa essa rota.
// Depois podemos remover completamente.
// ========================================

app.post(
    "/api/xp",
    async (req, res) => {

        try {

            const {
                usuarioId,
                xpGanho
            } = req.body;


            if (
                !usuarioId ||
                !xpGanho
            ) {

                return res
                    .status(400)
                    .json({

                        mensagem:
                            "Usuário e XP são obrigatórios."

                    });

            }


            const xp =
                Number(
                    xpGanho
                );


            if (
                !Number.isInteger(xp) ||
                xp <= 0 ||
                xp > 500
            ) {

                return res
                    .status(400)
                    .json({

                        mensagem:
                            "Quantidade de XP inválida."

                    });

            }


            const resultado =
                await pool.query(
                    `
                    UPDATE usuarios

                    SET xp =
                        xp + $1

                    WHERE id = $2

                    RETURNING
                        id,
                        nome,
                        xp,
                        sequencia,
                        ultima_atividade
                    `,
                    [
                        xp,
                        usuarioId
                    ]
                );


            if (
                resultado.rows.length === 0
            ) {

                return res
                    .status(404)
                    .json({

                        mensagem:
                            "Usuário não encontrado."

                    });

            }


            res.json({

                mensagem:
                    "XP adicionado com sucesso!",

                usuario:
                    resultado.rows[0]

            });

        } catch (erro) {

            console.error(
                "Erro ao adicionar XP:",
                erro
            );


            res
                .status(500)
                .json({

                    mensagem:
                        "Erro ao adicionar XP."

                });

        }

    }
);


// ========================================
// SERVIDOR
// ========================================

const PORT = 3000;


console.log(
    "ECOENERGIA - SEQUENCIA 24 HORAS"
);


const servidor =
    app.listen(
        PORT,
        () => {

            console.log(
                `Servidor rodando em http://localhost:${PORT}`
            );

        }
    );


servidor.on(
    "error",
    (erro) => {

        console.error(
            "ERRO DO SERVIDOR:",
            erro
        );

    }
);


servidor.on(
    "close",
    () => {

        console.log(
            "ATENCAO: O SERVIDOR FOI FECHADO!"
        );

    }
);