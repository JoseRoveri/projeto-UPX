"use strict";

const banco = require("./database");

async function consultarCompanheiro(req, res) {
    res.set("Cache-Control", "no-store");

    try {
        const resultado = await banco.query(`
            SELECT
                id,
                nome,
                especie,
                cor_principal AS "corPrincipal",
                cor_secundaria AS "corSecundaria",
                olhos,
                expressao,
                criado_em AS "criadoEm",
                atualizado_em AS "atualizadoEm"
            FROM public.companheiros
            WHERE usuario_id = $1
        `, [req.usuario.id]);

        const companheiro = resultado.rows[0];

        if (!companheiro) {
            return res.json({
                criado: false,
                companheiro: null
            });
        }

        return res.json({
            criado: true,
            companheiro
        });

    } catch (erro) {
        console.error(
            "Erro ao consultar companheiro:",
            erro.message
        );

        return res.status(500).json({
            mensagem: "Não foi possível carregar seu companheiro."
        });
    }
}

module.exports = {
    consultarCompanheiro,
    criarCompanheiro
};

async function criarCompanheiro(req, res) {
    res.set("Cache-Control", "no-store");

    const nome = typeof req.body?.nome === "string"
        ? req.body.nome.trim().replace(/\s+/g, " ")
        : "";

    const especie = req.body?.especie;
    const corPrincipal = req.body?.corPrincipal;
    const corSecundaria = req.body?.corSecundaria;
    const olhos = req.body?.olhos;
    const expressao = req.body?.expressao;

    const especiesPermitidas = [
        "brotim",
        "gotim",
        "faisquinha"
    ];

    const coresPrincipaisPermitidas = [
        "azul",
        "verde",
        "amarelo",
        "roxo",
        "rosa",
        "laranja"
    ];

    const coresSecundariasPermitidas = [
        "claro",
        "turquesa",
        "amarelo",
        "creme"
    ];

    const olhosPermitidos = [
        "redondos",
        "grandes",
        "brilhantes"
    ];

    const expressoesPermitidas = [
        "sorriso",
        "animado",
        "curioso"
    ];

    if (!nome || nome.length > 20) {
        return res.status(400).json({
            mensagem: "Escolha um nome com até 20 caracteres."
        });
    }

    if (!especiesPermitidas.includes(especie)) {
        return res.status(400).json({
            mensagem: "Espécie inválida."
        });
    }

    if (!coresPrincipaisPermitidas.includes(corPrincipal)) {
        return res.status(400).json({
            mensagem: "Cor principal inválida."
        });
    }

    if (!coresSecundariasPermitidas.includes(corSecundaria)) {
        return res.status(400).json({
            mensagem: "Cor secundária inválida."
        });
    }

    if (!olhosPermitidos.includes(olhos)) {
        return res.status(400).json({
            mensagem: "Tipo de olhos inválido."
        });
    }

    if (!expressoesPermitidas.includes(expressao)) {
        return res.status(400).json({
            mensagem: "Expressão inválida."
        });
    }

    try {
        const resultado = await banco.query(`
            INSERT INTO public.companheiros (
                usuario_id,
                nome,
                especie,
                cor_principal,
                cor_secundaria,
                olhos,
                expressao
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)

            ON CONFLICT (usuario_id)
            DO NOTHING

            RETURNING
                id,
                nome,
                especie,
                cor_principal AS "corPrincipal",
                cor_secundaria AS "corSecundaria",
                olhos,
                expressao,
                criado_em AS "criadoEm",
                atualizado_em AS "atualizadoEm"
        `, [
            req.usuario.id,
            nome,
            especie,
            corPrincipal,
            corSecundaria,
            olhos,
            expressao
        ]);

        const companheiro = resultado.rows[0];

        if (!companheiro) {
            return res.status(409).json({
                mensagem: "Você já possui um companheiro."
            });
        }

        return res.status(201).json({
            mensagem: "Companheiro criado com sucesso!",
            companheiro
        });

    } catch (erro) {
        console.error(
            "Erro ao criar companheiro:",
            erro.message
        );

        return res.status(500).json({
            mensagem: "Não foi possível criar seu companheiro."
        });
    }
}