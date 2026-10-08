const express = require("express");
const path = require("node:path");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const banco = require("./database");
const fazerLogin = require("./login");
const autenticar = require("./autenticar");
const fazerLogout = require("./logout");
const listarRanking = require("./ranking");
const concluirAtividade = require("./concluir-atividade");
const corrigirBloco = require("./corrigir-bloco");

const {
    consultarPerfil,
    atualizarPerfil
} = require("./perfil-conta");

const companheiro = require("./companheiro");
const trilhaFacil = require("./trilha-facil");

const trilhasDisponiveis = [trilhaFacil];


// =========================================================
// RECOMPENSAS ESPECIAIS DA TRILHA FÁCIL
// =========================================================

async function sincronizarConquistasLoja(usuarioId) {

    const idsBlocos = trilhaFacil.modulos.flatMap(
        modulo =>
            modulo.blocos.map(
                bloco => bloco.atividadeId
            )
    );


    const resultado = await banco.query(`
        SELECT
            atividade_id

        FROM public.atividades_concluidas

        WHERE usuario_id = $1
          AND atividade_id = ANY($2::text[])
          AND total_perguntas > 0
          AND acertos * 2 >= total_perguntas
    `, [
        usuarioId,
        idsBlocos
    ]);


    const concluidos = new Set(
        resultado.rows.map(
            registro =>
                registro.atividade_id
        )
    );


    const requisitosLiberados = [];


    // -----------------------------------------------------
    // VERIFICA OS 5 MÓDULOS
    // -----------------------------------------------------

    trilhaFacil.modulos.forEach(
        (modulo, indice) => {

            const moduloConcluido =

                modulo.blocos.length > 0 &&

                modulo.blocos.every(
                    bloco =>
                        concluidos.has(
                            bloco.atividadeId
                        )
                );


            if (moduloConcluido) {

                requisitosLiberados.push(
                    `facil_modulo_${indice + 1}`
                );

            }

        }
    );


    // -----------------------------------------------------
    // VERIFICA SE A TRILHA FÁCIL INTEIRA FOI CONCLUÍDA
    // -----------------------------------------------------

    const trilhaCompleta =
        trilhaFacil.modulos.every(

            modulo =>

                modulo.blocos.length > 0 &&

                modulo.blocos.every(
                    bloco =>
                        concluidos.has(
                            bloco.atividadeId
                        )
                )

        );


    if (trilhaCompleta) {

        requisitosLiberados.push(
            "facil_trilha_completa"
        );

    }


    // Nenhuma conquista liberada ainda.
    if (requisitosLiberados.length === 0) {

        return;

    }


    // -----------------------------------------------------
    // ENTREGA AUTOMATICAMENTE OS ITENS CONQUISTADOS
    // -----------------------------------------------------

    await banco.query(`
        INSERT INTO public.itens_usuario (
            usuario_id,
            item_id
        )

        SELECT
            $1,
            item.id

        FROM public.itens_loja AS item

        WHERE item.ativo = true

          AND item.tipo_aquisicao = 'conquista'

          AND item.requisito = ANY($2::text[])

          AND NOT EXISTS (

              SELECT 1

              FROM public.itens_usuario AS usuario_item

              WHERE usuario_item.usuario_id = $1

                AND usuario_item.item_id = item.id

          )

        ON CONFLICT DO NOTHING
    `, [
        usuarioId,
        requisitosLiberados
    ]);

}


// =========================================================
// EXPRESS
// =========================================================

const app = express();

app.set("trust proxy", 1);

app.use(express.json());

app.use(cookieParser());

const frontendPath =
    path.join(
        __dirname,
        "..",
        "frontend"
    );

app.use(
    express.static(
        frontendPath
    )
);


// =========================================================
// TESTES
// =========================================================

app.get("/api/status", (req, res) => {

    res.json({

        mensagem:
            "Servidor EcoEnergia funcionando!"

    });

});


app.get("/teste-banco", async (req, res) => {

    try {

        const resultado = await banco.query(`
            SELECT
                COUNT(*) AS total

            FROM public.usuarios
        `);


        res.json({

            mensagem:
                "Conexão com PostgreSQL funcionando!",

            usuariosCadastrados:
                Number(
                    resultado.rows[0].total
                )

        });


    } catch (erro) {

        console.error(
            "Erro ao consultar o banco:",
            erro.message
        );


        res.status(500).json({

            mensagem:
                "Não foi possível consultar o banco."

        });

    }

});


// =========================================================
// CADASTRO
// =========================================================

app.post("/api/cadastro", async (req, res) => {

    try {

        const {
            nome,
            email,
            senha,
            tipo
        } = req.body || {};


        if (

            typeof nome !== "string" ||
            !nome.trim() ||

            typeof email !== "string" ||
            !email.trim() ||

            typeof senha !== "string" ||
            !senha.trim() ||

            ![
                "aluno",
                "professor",
                "responsavel"
            ].includes(tipo)

        ) {

            return res.status(400).json({

                mensagem:
                    "Preencha todos os campos corretamente."

            });

        }


        const nomeLimpo =
            nome.trim();


        const emailLimpo =
            email
                .trim()
                .toLowerCase();


        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                emailLimpo
            )
        ) {

            return res.status(400).json({

                mensagem:
                    "Digite um e-mail válido."

            });

        }


        if (senha.length < 8) {

            return res.status(400).json({

                mensagem:
                    "A senha precisa ter pelo menos 8 caracteres."

            });

        }


        if (
            Buffer.byteLength(
                senha,
                "utf8"
            ) > 72
        ) {

            return res.status(400).json({

                mensagem:
                    "Senha muito longa. Use uma senha mais curta."

            });

        }


        const senhaHash =
            await bcrypt.hash(
                senha,
                10
            );


        await banco.query(`
            INSERT INTO public.usuarios (
                nome,
                email,
                senha_hash,
                tipo
            )

            VALUES (
                $1,
                $2,
                $3,
                $4
            )
        `, [
            nomeLimpo,
            emailLimpo,
            senhaHash,
            tipo
        ]);


        res.status(201).json({

            mensagem:
                "Cadastro realizado com sucesso!"

        });


    } catch (erro) {

        if (

            erro.code === "23505" &&

            erro.constraint ===
            "usuarios_email_unico"

        ) {

            return res.status(409).json({

                mensagem:
                    "Este e-mail já está cadastrado."

            });

        }


        console.error(
            "Erro ao cadastrar:",
            erro.message
        );


        res.status(500).json({

            mensagem:
                "Não foi possível realizar o cadastro."

        });

    }

});


// =========================================================
// LOGIN / LOGOUT / SESSÃO
// =========================================================

app.post(
    "/api/login",
    fazerLogin
);


app.post(
    "/api/logout",
    fazerLogout
);


app.get(
    "/api/me",
    autenticar,
    (req, res) => {

        res.json({

            usuario:
                req.usuario

        });

    }
);


app.get(
    "/api/ranking",
    listarRanking
);


// =========================================================
// TRILHAS
// =========================================================

// Consulta pública.
// Visitantes também podem ver a estrutura da trilha.
app.get(
    "/api/trilhas/:nivel",
    (req, res) => {

        res.set(
            "Cache-Control",
            "no-store"
        );


        const trilha =
            trilhasDisponiveis.find(

                item =>
                    item.nivel ===
                    req.params.nivel

            );


        if (!trilha) {

            return res.status(404).json({

                mensagem:
                    "Esta dificuldade ainda não possui uma trilha disponível."

            });

        }


        const modulos =
            trilha.modulos.map(

                modulo => ({

                    id:
                        modulo.id,

                    nome:
                        modulo.nome,

                    ordem:
                        modulo.ordem,

                    introducao:
                        modulo.introducao,

                    blocos:
                        modulo.blocos.map(

                            bloco => ({

                                atividadeId:
                                    bloco.atividadeId,

                                nome:
                                    bloco.nome,

                                ordem:
                                    bloco.ordem,

                                totalPerguntas:
                                    bloco.perguntas.length,

                                xpMaximo:
                                    bloco.perguntas.length *
                                    trilha.xpPorAcerto

                            })

                        )

                })

            );


        const blocos =
            modulos.flatMap(
                modulo =>
                    modulo.blocos
            );


        const totalPerguntas =
            blocos.reduce(

                (total, bloco) =>
                    total +
                    bloco.totalPerguntas,

                0

            );


        res.json({

            nivel:
                trilha.nivel,

            nome:
                trilha.nome,

            emoji:
                trilha.emoji,

            versao:
                trilha.versao,

            xpPorAcerto:
                trilha.xpPorAcerto,

            totalModulos:
                modulos.length,

            totalBlocos:
                blocos.length,

            totalPerguntas,

            modulos

        });

    }
);


// =========================================================
// PERGUNTAS DO BLOCO
// =========================================================

app.get(
    "/api/trilhas/:nivel/blocos/:atividadeId",
    (req, res) => {

        res.set(
            "Cache-Control",
            "no-store"
        );


        const trilha =
            trilhasDisponiveis.find(

                item =>
                    item.nivel ===
                    req.params.nivel

            );


        if (!trilha) {

            return res.status(404).json({

                mensagem:
                    "Esta dificuldade ainda não possui uma trilha disponível."

            });

        }


        const modulo =
            trilha.modulos.find(

                item =>
                    item.blocos.some(

                        bloco =>
                            bloco.atividadeId ===
                            req.params.atividadeId

                    )

            );


        if (!modulo) {

            return res.status(404).json({

                mensagem:
                    "Bloco não encontrado nesta trilha."

            });

        }


        const bloco =
            modulo.blocos.find(

                item =>
                    item.atividadeId ===
                    req.params.atividadeId

            );


        const perguntas =
            bloco.perguntas.map(

                pergunta => ({

                    id:
                        pergunta.id,

                    tema:
                        pergunta.tema,

                    categoria:
                        pergunta.categoria,

                    pergunta:
                        pergunta.pergunta,

                    alternativas:
                        pergunta.alternativas

                })

            );


        res.json({

            nivel:
                trilha.nivel,

            atividadeId:
                bloco.atividadeId,

            moduloId:
                modulo.id,

            moduloNome:
                modulo.nome,

            nome:
                bloco.nome,

            totalPerguntas:
                perguntas.length,

            xpPorAcerto:
                trilha.xpPorAcerto,

            xpMaximo:
                perguntas.length *
                trilha.xpPorAcerto,

            perguntas

        });

    }
);


// =========================================================
// PROGRESSO DA TRILHA
// =========================================================

app.get(
    "/api/trilhas/:nivel/progresso",
    autenticar,
    async (req, res) => {

        res.set(
            "Cache-Control",
            "no-store"
        );


        const trilha =
            trilhasDisponiveis.find(

                item =>
                    item.nivel ===
                    req.params.nivel

            );


        if (!trilha) {

            return res.status(404).json({

                mensagem:
                    "Esta dificuldade ainda não possui uma trilha disponível."

            });

        }


        const blocos =
            trilha.modulos.flatMap(
                modulo =>
                    modulo.blocos
            );


        const idsDosBlocos =
            blocos.map(
                bloco =>
                    bloco.atividadeId
            );


        try {

            const resultado =
                await banco.query(`
                    SELECT
                        atividade_id

                    FROM public.atividades_concluidas

                    WHERE usuario_id = $1

                      AND atividade_id =
                          ANY($2::text[])

                      AND total_perguntas > 0

                      AND acertos * 2 >=
                          total_perguntas
                `, [
                    req.usuario.id,
                    idsDosBlocos
                ]);


            const idsConcluidos =
                new Set(

                    resultado.rows.map(
                        registro =>
                            registro.atividade_id
                    )

                );


            let anterioresConcluidos =
                true;


            const progresso =
                blocos.map(
                    bloco => {

                        const concluido =
                            idsConcluidos.has(
                                bloco.atividadeId
                            );


                        const liberado =
                            concluido ||
                            anterioresConcluidos;


                        anterioresConcluidos =
                            anterioresConcluidos &&
                            concluido;


                        return {

                            atividadeId:
                                bloco.atividadeId,

                            concluido,

                            liberado

                        };

                    }
                );


            const blocosConcluidos =
                progresso.filter(
                    bloco =>
                        bloco.concluido
                ).length;


            const proximoBloco =
                progresso.find(

                    bloco =>
                        !bloco.concluido &&
                        bloco.liberado

                );


            res.json({

                nivel:
                    trilha.nivel,

                totalBlocos:
                    blocos.length,

                blocosConcluidos,

                porcentagem:
                    blocos.length > 0

                        ? Math.round(
                            (
                                blocosConcluidos /
                                blocos.length
                            ) * 100
                        )

                        : 0,

                proximaAtividadeId:
                    proximoBloco
                        ?.atividadeId ??
                    null,

                blocos:
                    progresso

            });


        } catch (erro) {

            console.error(
                "Erro ao consultar progresso:",
                erro.message
            );


            res.status(500).json({

                mensagem:
                    "Não foi possível consultar o progresso da trilha."

            });

        }

    }
);


// =========================================================
// CONCLUIR ATIVIDADE
// =========================================================

app.post(
    "/api/atividade/corrigir-visitante",
    (req, res) => {

        res.set(
            "Cache-Control",
            "no-store"
        );

        const {
            atividadeId,
            respostas
        } = req.body || {};

        const correcao =
            corrigirBloco(
                atividadeId,
                respostas
            );

        if (!correcao.valido) {
            return res.status(400).json({
                mensagem: correcao.mensagem
            });
        }

        const aprovado =
            correcao.acertos * 2 >=
            correcao.totalPerguntas;

        return res.json({
            visitante: true,

            aprovado,

            concluido: aprovado,

            totalPerguntas:
                correcao.totalPerguntas,

            acertos:
                correcao.acertos,

            xpGanho: 0,

            resultados:
                correcao.resultados,

            proximaAtividadeId: null,

            mensagem: aprovado
                ? "Bloco concluído! Como visitante, seu progresso e XP não são salvos."
                : "Você precisa acertar pelo menos metade das perguntas. Tente novamente."
        });
    }
);

app.post(
    "/api/atividade/concluir",
    autenticar,
    concluirAtividade
);


// =========================================================
// RECOMPENSAS DE ECOMOEDAS
// =========================================================

app.get(
    "/api/recompensas",
    autenticar,
    async (req, res) => {

        res.set(
            "Cache-Control",
            "no-store"
        );


        try {

            const resultado =
                await banco.query(`
                    SELECT

                        recompensa.id,

                        recompensa.nome,

                        recompensa.xp_necessario
                            AS xp,

                        recompensa.moedas,

                        CASE

                            WHEN recebida.recompensa_id
                                IS NULL
                                THEN 'bloqueada'

                            WHEN recebida.resgatada_em
                                IS NULL
                                THEN 'liberada'

                            ELSE 'recebida'

                        END AS status,

                        recebida.recebida_em
                            AS "liberadaEm",

                        recebida.resgatada_em
                            AS "resgatadaEm"

                    FROM public.recompensas
                        AS recompensa

                    LEFT JOIN
                        public.recompensas_recebidas
                        AS recebida

                        ON recebida.recompensa_id =
                            recompensa.id

                        AND recebida.usuario_id = $1

                    ORDER BY
                        recompensa.xp_necessario ASC
                `, [
                    req.usuario.id
                ]);


            res.json({

                recompensas:
                    resultado.rows

            });


        } catch (erro) {

            console.error(

                "Erro ao consultar recompensas:",

                erro.message

            );


            res.status(500).json({

                mensagem:
                    "Não foi possível carregar as recompensas."

            });

        }

    }
);


// =========================================================
// RESGATAR RECOMPENSA
// =========================================================

app.post(
    "/api/recompensas/:id/resgatar",
    autenticar,
    async (req, res) => {

        res.set(
            "Cache-Control",
            "no-store"
        );


        const recompensaId =
            Number(
                req.params.id
            );


        const usuarioId =
            req.usuario.id;


        if (
            !Number.isInteger(
                recompensaId
            ) ||
            recompensaId <= 0
        ) {

            return res.status(400).json({

                mensagem:
                    "Recompensa inválida."

            });

        }


        let cliente;


        try {

            cliente =
                await banco.connect();


            await cliente.query(
                "BEGIN"
            );


            const resultado =
                await cliente.query(`
                    SELECT

                        recebida.recompensa_id,

                        recebida.resgatada_em,

                        recompensa.nome,

                        recompensa.moedas

                    FROM
                        public.recompensas_recebidas
                        AS recebida

                    INNER JOIN
                        public.recompensas
                        AS recompensa

                        ON recompensa.id =
                            recebida.recompensa_id

                    WHERE
                        recebida.usuario_id = $1

                      AND recebida.recompensa_id = $2

                    FOR UPDATE
                `, [
                    usuarioId,
                    recompensaId
                ]);


            const recompensa =
                resultado.rows[0];


            if (!recompensa) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res.status(403).json({

                    mensagem:
                        "Esta recompensa ainda não foi liberada."

                });

            }


            if (
                recompensa.resgatada_em
            ) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res.status(409).json({

                    mensagem:
                        "Esta recompensa já foi recebida."

                });

            }


            await cliente.query(`
                UPDATE
                    public.recompensas_recebidas

                SET
                    resgatada_em = NOW()

                WHERE
                    usuario_id = $1

                  AND recompensa_id = $2
            `, [
                usuarioId,
                recompensaId
            ]);


            const conta =
                await cliente.query(`
                    UPDATE public.usuarios

                    SET
                        moedas = moedas + $2

                    WHERE id = $1

                    RETURNING moedas
                `, [
                    usuarioId,
                    Number(
                        recompensa.moedas
                    )
                ]);


            await cliente.query(
                "COMMIT"
            );


            return res.json({

                mensagem:
                    "Recompensa recebida!",

                recompensa: {

                    id:
                        recompensaId,

                    nome:
                        recompensa.nome,

                    moedas:
                        Number(
                            recompensa.moedas
                        )

                },

                moedasTotal:
                    Number(
                        conta.rows[0].moedas
                    )

            });


        } catch (erro) {

            if (cliente) {

                try {

                    await cliente.query(
                        "ROLLBACK"
                    );

                } catch { }

            }


            console.error(

                "Erro ao resgatar recompensa:",

                erro.message

            );


            return res.status(500).json({

                mensagem:
                    "Não foi possível receber a recompensa."

            });


        } finally {

            if (cliente) {

                cliente.release();

            }

        }

    }
);


// =========================================================
// LOJA
// =========================================================

app.get("/api/loja-publica", async (req, res) => {

    res.set(
        "Cache-Control",
        "no-store"
    );

    try {

        const resultado =
            await banco.query(`
                SELECT
                    id,
                    nome,
                    descricao,
                    preco,
                    categoria,
                    imagem,
                    tipo_aquisicao AS "tipoAquisicao",
                    requisito,

                    false AS comprado,
                    false AS equipado,

                    CASE
                        WHEN tipo_aquisicao = 'loja'
                            THEN true
                        ELSE false
                    END AS liberado

                FROM public.itens_loja

                WHERE ativo = true

                ORDER BY
                    preco ASC,
                    id ASC
            `);

        res.json({
            itens: resultado.rows
        });

    } catch (erro) {

        console.error(
            "Erro ao consultar loja pública:",
            erro.message
        );

        res.status(500).json({
            mensagem:
                "Não foi possível carregar os itens da loja."
        });

    }

});

app.get("/api/loja", autenticar, async (req, res) => {

    res.set(
        "Cache-Control",
        "no-store"
    );


    try {

        // Confere o progresso antes
        // de montar a loja.
        //
        // Se o usuário já concluiu um módulo,
        // a recompensa é adicionada automaticamente
        // à coleção.

        await sincronizarConquistasLoja(
            req.usuario.id
        );


        const resultado =
            await banco.query(`
                    SELECT

                        item.id,

                        item.nome,

                        item.descricao,

                        item.preco,

                        item.categoria,

                        item.imagem,

                        item.tipo_aquisicao
                            AS "tipoAquisicao",

                        item.requisito,


                        CASE

                            WHEN usuario_item.item_id
                                IS NULL

                                THEN false

                            ELSE true

                        END AS comprado,


                        CASE

                            WHEN equipado.item_id
                                IS NULL

                                THEN false

                            ELSE true

                        END AS equipado,


                        CASE

                            WHEN item.tipo_aquisicao =
                                'loja'

                                THEN true

                            WHEN usuario_item.item_id
                                IS NOT NULL

                                THEN true

                            ELSE false

                        END AS liberado


                    FROM
                        public.itens_loja
                        AS item


                    LEFT JOIN
                        public.itens_usuario
                        AS usuario_item

                        ON usuario_item.item_id =
                            item.id

                        AND usuario_item.usuario_id =
                            $1


                    LEFT JOIN
                        public.itens_equipados
                        AS equipado

                        ON equipado.item_id =
                            item.id

                        AND equipado.usuario_id =
                            $1

                        AND equipado.categoria =
                            item.categoria


                    WHERE
                        item.ativo = true


                    ORDER BY

                        item.preco ASC,

                        item.id ASC
                `, [
                req.usuario.id
            ]);


        res.json({

            itens:
                resultado.rows

        });


    } catch (erro) {

        console.error(

            "Erro ao consultar loja:",

            erro.message

        );


        res.status(500).json({

            mensagem:
                "Não foi possível carregar os itens da loja."

        });

    }

}
);


// =========================================================
// COMPRAR ITEM
// =========================================================

app.post(
    "/api/loja/:id/comprar",
    autenticar,
    async (req, res) => {

        res.set(
            "Cache-Control",
            "no-store"
        );


        const itemId =
            Number(
                req.params.id
            );


        const usuarioId =
            req.usuario.id;


        if (
            !Number.isInteger(
                itemId
            ) ||
            itemId <= 0
        ) {

            return res.status(400).json({

                mensagem:
                    "Item inválido."

            });

        }


        let cliente;


        try {

            cliente =
                await banco.connect();


            await cliente.query(
                "BEGIN"
            );


            // -------------------------------------------------
            // CONTA
            // -------------------------------------------------

            const contaResultado =
                await cliente.query(`
                    SELECT

                        id,

                        moedas

                    FROM
                        public.usuarios

                    WHERE
                        id = $1

                    FOR UPDATE
                `, [
                    usuarioId
                ]);


            const usuario =
                contaResultado.rows[0];


            if (!usuario) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res.status(401).json({

                    mensagem:
                        "Entre novamente na sua conta."

                });

            }


            // -------------------------------------------------
            // ITEM
            // -------------------------------------------------

            const itemResultado =
                await cliente.query(`
                    SELECT

                        id,

                        nome,

                        preco,

                        categoria,

                        imagem,

                        tipo_aquisicao,

                        requisito

                    FROM
                        public.itens_loja

                    WHERE
                        id = $1

                      AND ativo = true
                `, [
                    itemId
                ]);


            const item =
                itemResultado.rows[0];


            if (!item) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res.status(404).json({

                    mensagem:
                        "Item não encontrado."

                });

            }


            // =================================================
            // CORREÇÃO PRINCIPAL
            // =================================================
            //
            // Recompensas de conquista não podem ser
            // compradas, mesmo se o preço for 0.
            //
            // Elas só entram em itens_usuario quando o
            // requisito da trilha for realmente concluído.
            // =================================================

            if (
                item.tipo_aquisicao ===
                "conquista"
            ) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res.status(403).json({

                    mensagem:
                        "Este item é uma recompensa de conquista. Complete o desafio para desbloqueá-lo."

                });

            }


            // -------------------------------------------------
            // JÁ POSSUI?
            // -------------------------------------------------

            const jaComprado =
                await cliente.query(`
                    SELECT 1

                    FROM
                        public.itens_usuario

                    WHERE
                        usuario_id = $1

                      AND item_id = $2
                `, [
                    usuarioId,
                    itemId
                ]);


            if (
                jaComprado.rows[0]
            ) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res.status(409).json({

                    mensagem:
                        "Você já possui este item."

                });

            }


            // -------------------------------------------------
            // PREÇO
            // -------------------------------------------------

            const preco =
                Number(
                    item.preco
                );


            const moedas =
                Number(
                    usuario.moedas
                ) || 0;


            if (
                moedas < preco
            ) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res.status(400).json({

                    mensagem:
                        "Você ainda não possui EcoMoedas suficientes.",

                    moedasTotal:
                        moedas,

                    preco,

                    faltam:
                        preco - moedas

                });

            }


            // -------------------------------------------------
            // ENTREGA ITEM
            // -------------------------------------------------

            await cliente.query(`
                INSERT INTO
                    public.itens_usuario (
                        usuario_id,
                        item_id
                    )

                VALUES (
                    $1,
                    $2
                )
            `, [
                usuarioId,
                itemId
            ]);


            // -------------------------------------------------
            // DESCONTA MOEDAS
            // -------------------------------------------------

            const saldoResultado =
                await cliente.query(`
                    UPDATE
                        public.usuarios

                    SET
                        moedas =
                            moedas - $2

                    WHERE
                        id = $1

                    RETURNING
                        moedas
                `, [
                    usuarioId,
                    preco
                ]);


            await cliente.query(
                "COMMIT"
            );


            return res.json({

                mensagem:
                    "Item comprado com sucesso!",

                item: {

                    id:
                        Number(
                            item.id
                        ),

                    nome:
                        item.nome,

                    preco,

                    categoria:
                        item.categoria,

                    imagem:
                        item.imagem

                },

                moedasTotal:
                    Number(
                        saldoResultado
                            .rows[0]
                            .moedas
                    )

            });


        } catch (erro) {

            if (cliente) {

                try {

                    await cliente.query(
                        "ROLLBACK"
                    );

                } catch { }

            }


            console.error(

                "Erro ao comprar item:",

                erro.message

            );


            return res.status(500).json({

                mensagem:
                    "Não foi possível comprar o item."

            });


        } finally {

            if (cliente) {

                cliente.release();

            }

        }

    }
);


// =========================================================
// EQUIPAR ITEM
// =========================================================

app.post(
    "/api/loja/:id/equipar",
    autenticar,
    async (req, res) => {

        res.set(
            "Cache-Control",
            "no-store"
        );


        const itemId =
            Number(
                req.params.id
            );


        const usuarioId =
            req.usuario.id;


        if (
            !Number.isInteger(
                itemId
            ) ||
            itemId <= 0
        ) {

            return res.status(400).json({

                mensagem:
                    "Item inválido."

            });

        }


        let cliente;


        try {

            cliente =
                await banco.connect();


            await cliente.query(
                "BEGIN"
            );


            // Só pode equipar um item
            // que já pertence ao usuário.
            //
            // Pode ter vindo de compra
            // OU de uma conquista.

            const resultado =
                await cliente.query(`
                    SELECT

                        item.id,

                        item.nome,

                        item.categoria,

                        item.imagem

                    FROM
                        public.itens_usuario
                        AS usuario_item

                    INNER JOIN
                        public.itens_loja
                        AS item

                        ON item.id =
                            usuario_item.item_id

                    WHERE
                        usuario_item.usuario_id =
                            $1

                      AND usuario_item.item_id =
                            $2

                      AND item.ativo = true
                `, [
                    usuarioId,
                    itemId
                ]);


            const item =
                resultado.rows[0];


            if (!item) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res.status(403).json({

                    mensagem:
                        "Você precisa possuir este item antes de equipá-lo."

                });

            }


            await cliente.query(`
                INSERT INTO
                    public.itens_equipados (
                        usuario_id,
                        categoria,
                        item_id
                    )

                VALUES (
                    $1,
                    $2,
                    $3
                )

                ON CONFLICT (
                    usuario_id,
                    categoria
                )

                DO UPDATE SET

                    item_id =
                        EXCLUDED.item_id,

                    equipado_em =
                        CURRENT_TIMESTAMP
            `, [
                usuarioId,
                item.categoria,
                itemId
            ]);


            await cliente.query(
                "COMMIT"
            );


            return res.json({

                mensagem:
                    "Item equipado com sucesso!",

                item: {

                    id:
                        Number(
                            item.id
                        ),

                    nome:
                        item.nome,

                    categoria:
                        item.categoria,

                    imagem:
                        item.imagem

                }

            });


        } catch (erro) {

            if (cliente) {

                try {

                    await cliente.query(
                        "ROLLBACK"
                    );

                } catch { }

            }


            console.error(

                "Erro ao equipar item:",

                erro.message

            );


            return res.status(500).json({

                mensagem:
                    "Não foi possível equipar o item."

            });


        } finally {

            if (cliente) {

                cliente.release();

            }

        }

    }
);


// =========================================================
// DESEQUIPAR ITEM
// =========================================================

app.post(
    "/api/loja/:id/desequipar",
    autenticar,
    async (req, res) => {

        res.set(
            "Cache-Control",
            "no-store"
        );


        const itemId =
            Number(
                req.params.id
            );


        const usuarioId =
            req.usuario.id;


        if (
            !Number.isInteger(
                itemId
            ) ||
            itemId <= 0
        ) {

            return res.status(400).json({

                mensagem:
                    "Item inválido."

            });

        }


        try {

            const resultado =
                await banco.query(`
                    DELETE FROM
                        public.itens_equipados

                    WHERE
                        usuario_id = $1

                      AND item_id = $2

                    RETURNING

                        item_id,

                        categoria
                `, [
                    usuarioId,
                    itemId
                ]);


            if (
                !resultado.rows[0]
            ) {

                return res.status(409).json({

                    mensagem:
                        "Este item não está equipado."

                });

            }


            return res.json({

                mensagem:
                    "Item desequipado com sucesso!",

                itemId

            });


        } catch (erro) {

            console.error(

                "Erro ao desequipar item:",

                erro.message

            );


            return res.status(500).json({

                mensagem:
                    "Não foi possível desequipar o item."

            });

        }

    }
);


// =========================================================
// PERFIL
// =========================================================

app.get(
    "/api/perfil",
    autenticar,
    consultarPerfil
);


app.patch(
    "/api/perfil",
    autenticar,
    atualizarPerfil
);


// =========================================================
// COMPANHEIRO
// =========================================================

app.get(
    "/api/companheiro",
    autenticar,
    companheiro.consultarCompanheiro
);


app.post(
    "/api/companheiro",
    autenticar,
    companheiro.criarCompanheiro
);


// =========================================================
// SERVIDOR
// =========================================================

const PORT =
    Number(
        process.env.PORT ||
        3000
    );

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Servidor EcoEnergia rodando na porta ${PORT}`
        );

    }
);