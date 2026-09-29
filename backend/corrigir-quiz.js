const niveisQuiz = require("./perguntas");

function corrigirQuiz(atividadeId, respostas) {
    const configuracao = Object.values(niveisQuiz).find(
        nivel => nivel.atividadeId === atividadeId
    );

    if (!configuracao) {
        return {
            valido: false,
            mensagem: "Atividade não encontrada."
        };
    }

    const perguntas = configuracao.perguntas;

    if (!Array.isArray(respostas) || respostas.length !== perguntas.length) {
        return {
            valido: false,
            mensagem: "Envie uma alternativa para cada pergunta."
        };
    }

    let acertos = 0;

    for (let i = 0; i < perguntas.length; i++) {
        const resposta = respostas[i];
        const pergunta = perguntas[i];

        if (
            !Number.isInteger(resposta) ||
            resposta < 0 ||
            resposta >= pergunta.alternativas.length
        ) {
            return {
                valido: false,
                mensagem: `Alternativa inválida na pergunta ${i + 1}.`
            };
        }

        if (resposta === pergunta.correta) {
            acertos++;
        }
    }

    return {
        valido: true,
        atividadeId: configuracao.atividadeId,
        totalPerguntas: perguntas.length,
        acertos,
        xpCalculado: acertos * configuracao.xpPorAcerto
    };
}

module.exports = corrigirQuiz;