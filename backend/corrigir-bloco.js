"use strict";

const trilhaFacil = require("./trilha-facil");

function corrigirBloco(atividadeId, respostas) {
    // Localiza o bloco entre os módulos da dificuldade Fácil.
    const bloco = trilhaFacil.modulos
        .flatMap(modulo => modulo.blocos)
        .find(item => item.atividadeId === atividadeId);

    if (!bloco) {
        return {
            valido: false,
            mensagem: "Bloco não encontrado."
        };
    }

    // Cada pergunta precisa ter uma resposta.
    if (
        !Array.isArray(respostas) ||
        respostas.length !== bloco.perguntas.length
    ) {
        return {
            valido: false,
            mensagem: "Envie uma resposta para cada pergunta do bloco."
        };
    }

    // Aceita apenas posições de alternativas existentes: 0, 1, 2 ou 3.
    const respostasValidas = bloco.perguntas.every((pergunta, indice) => {
        const resposta = respostas[indice];

        return Number.isInteger(resposta) &&
            resposta >= 0 &&
            resposta < pergunta.alternativas.length;
    });

    if (!respostasValidas) {
        return {
            valido: false,
            mensagem: "Uma ou mais respostas possuem alternativas inválidas."
        };
    }

    // Compara as respostas recebidas com o gabarito do servidor.
    const resultados = bloco.perguntas.map((pergunta, indice) => ({
        perguntaId: pergunta.id,
        respostaEscolhida: respostas[indice],
        respostaCorreta: pergunta.correta,
        acertou: respostas[indice] === pergunta.correta,
        explicacao: pergunta.explicacao
    }));

    const acertos = resultados.filter(resultado => resultado.acertou).length;

    return {
        valido: true,
        atividadeId: bloco.atividadeId,
        totalPerguntas: bloco.perguntas.length,
        acertos,
        xpCalculado: acertos * trilhaFacil.xpPorAcerto,
        resultados
    };
}

module.exports = corrigirBloco;