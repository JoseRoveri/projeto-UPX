"use strict";

const trilhaFacil = require("./trilha-facil");

function corrigirBloco(atividadeId, respostas) {
    // Localiza o bloco solicitado.
    const bloco = trilhaFacil.modulos
        .flatMap(modulo => modulo.blocos)
        .find(item => item.atividadeId === atividadeId);

    if (!bloco) {
        return {
            valido: false,
            mensagem: "Bloco não encontrado."
        };
    }

    // Exige uma resposta para cada pergunta.
    if (
        !Array.isArray(respostas) ||
        respostas.length !== bloco.perguntas.length
    ) {
        return {
            valido: false,
            mensagem: "Envie uma resposta para cada pergunta do bloco."
        };
    }

    // Aceita somente índices inteiros de alternativas existentes.
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

    const resultados = bloco.perguntas.map((pergunta, indice) => {
        const respostaEscolhida = respostas[indice];
        const acertou = respostaEscolhida === pergunta.correta;

        // Busca a explicação da alternativa que a criança marcou.
        const explicacaoDaAlternativa =
            Array.isArray(pergunta.explicacoesAlternativas)
                ? pergunta.explicacoesAlternativas[respostaEscolhida]
                : null;

        let explicacao = acertou
            ? "Você acertou!"
            : "Essa alternativa não está correta. Tente novamente.";

        if (
            typeof explicacaoDaAlternativa === "string" &&
            explicacaoDaAlternativa.trim()
        ) {
            explicacao = explicacaoDaAlternativa.trim();
        } else if (
            acertou &&
            typeof pergunta.explicacao === "string" &&
            pergunta.explicacao.trim()
        ) {
            // Compatibilidade com perguntas que só têm explicação geral.
            explicacao = pergunta.explicacao.trim();
        }

        return {
            perguntaId: pergunta.id,
            respostaEscolhida,
            respostaCorreta: pergunta.correta,
            acertou,
            explicacao
        };
    });

    const acertos = resultados.filter(
        resultado => resultado.acertou
    ).length;

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