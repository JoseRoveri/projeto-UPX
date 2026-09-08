// ========================================
// QUIZ ECOENERGIA
// ========================================

(() => {

    // ========================================
    // IDENTIFICAÇÃO DA ATIVIDADE
    // ========================================

    const ATIVIDADE_ID =
        "quiz_agua_energia_01";


    // ========================================
    // PERGUNTAS
    // ========================================

    const perguntasQuiz = [

        {
            categoria: "💧 ECONOMIA DE ÁGUA",

            pergunta:
                "Qual atitude ajuda mais a economizar água durante o banho?",

            alternativas: [
                "Deixar o chuveiro ligado enquanto se ensaboa",
                "Fechar o chuveiro enquanto se ensaboa",
                "Tomar dois banhos seguidos",
                "Aumentar a pressão da água"
            ],

            correta: 1,

            explicacao:
                "Fechar o chuveiro enquanto se ensaboa evita desperdício de água."
        },

        {
            categoria: "⚡ ECONOMIA DE ENERGIA",

            pergunta:
                "Qual atitude ajuda a reduzir o consumo de energia em casa?",

            alternativas: [
                "Deixar todas as luzes acesas",
                "Abrir a geladeira várias vezes",
                "Apagar as luzes de ambientes vazios",
                "Deixar a televisão ligada sem ninguém assistir"
            ],

            correta: 2,

            explicacao:
                "Apagar as luzes quando ninguém está no ambiente ajuda a reduzir o consumo de energia."
        },

        {
            categoria: "💧 USO CONSCIENTE DA ÁGUA",

            pergunta:
                "Ao escovar os dentes, qual é a atitude mais sustentável?",

            alternativas: [
                "Deixar a torneira aberta o tempo todo",
                "Abrir a torneira apenas quando precisar",
                "Usar água quente durante toda a escovação",
                "Escovar os dentes com o chuveiro ligado"
            ],

            correta: 1,

            explicacao:
                "Abrir a torneira apenas quando necessário reduz bastante o desperdício de água."
        },

        {
            categoria: "⚡ ENERGIA",

            pergunta:
                "Qual aparelho costuma continuar consumindo energia quando fica em modo de espera?",

            alternativas: [
                "Televisão",
                "Cadeira",
                "Copo",
                "Livro"
            ],

            correta: 0,

            explicacao:
                "Alguns aparelhos eletrônicos continuam consumindo uma pequena quantidade de energia em modo de espera."
        },

        {
            categoria: "🌱 SUSTENTABILIDADE",

            pergunta:
                "Qual destas atitudes ajuda o meio ambiente?",

            alternativas: [
                "Desperdiçar água",
                "Jogar lixo no chão",
                "Reutilizar materiais sempre que possível",
                "Deixar equipamentos ligados sem necessidade"
            ],

            correta: 2,

            explicacao:
                "Reutilizar materiais reduz desperdícios e o consumo de novos recursos."
        },

        {
            categoria: "💧 ECONOMIA DE ÁGUA",

            pergunta:
                "Qual é uma boa maneira de economizar água ao lavar o carro?",

            alternativas: [
                "Usar uma mangueira ligada continuamente",
                "Usar balde e pano",
                "Deixar a água escorrer pela rua",
                "Lavar o carro todos os dias"
            ],

            correta: 1,

            explicacao:
                "Usar balde e pano normalmente utiliza menos água do que deixar uma mangueira aberta."
        },

        {
            categoria: "⚡ CONSUMO CONSCIENTE",

            pergunta:
                "Ao sair de um quarto vazio, o ideal é:",

            alternativas: [
                "Deixar a luz acesa",
                "Ligar mais aparelhos",
                "Apagar a luz",
                "Abrir a geladeira"
            ],

            correta: 2,

            explicacao:
                "Apagar a luz quando o ambiente não está sendo utilizado evita consumo desnecessário."
        },

        {
            categoria: "🌎 MEIO AMBIENTE",

            pergunta:
                "Por que economizar água é importante?",

            alternativas: [
                "Porque a água potável é um recurso que precisa ser preservado",
                "Porque toda a água do planeta pode ser consumida diretamente",
                "Porque nunca existe falta de água",
                "Porque a água não é utilizada na produção de alimentos"
            ],

            correta: 0,

            explicacao:
                "A água própria para consumo é limitada e precisa ser utilizada de maneira consciente."
        },

        {
            categoria: "⚡ ENERGIA",

            pergunta:
                "Qual alternativa ajuda a aproveitar melhor a iluminação durante o dia?",

            alternativas: [
                "Fechar todas as cortinas",
                "Acender todas as lâmpadas",
                "Aproveitar a luz natural",
                "Usar várias luminárias ao mesmo tempo"
            ],

            correta: 2,

            explicacao:
                "Aproveitar a luz natural reduz a necessidade de utilizar iluminação elétrica."
        },

        {
            categoria: "🌱 ECOENERGIA",

            pergunta:
                "Qual destas opções representa um hábito sustentável?",

            alternativas: [
                "Desperdiçar recursos",
                "Consumir água e energia sem necessidade",
                "Usar os recursos naturais de forma consciente",
                "Manter aparelhos ligados o dia inteiro"
            ],

            correta: 2,

            explicacao:
                "Usar água, energia e outros recursos de maneira consciente é um hábito sustentável."
        }

    ];


    // ========================================
    // VARIÁVEIS
    // ========================================

    let perguntaAtualQuiz = 0;
    let acertosQuiz = 0;
    let respondeuQuiz = false;

    // XP mostrado durante a tentativa.
    // O backend é quem decide o XP realmente recebido.
    let xpQuiz = 0;


    // ========================================
    // ELEMENTOS
    // ========================================

    const introducaoQuiz =
        document.getElementById(
            "quiz-introducao"
        );

    const areaQuiz =
        document.getElementById(
            "quiz-area"
        );

    const resultadoQuiz =
        document.getElementById(
            "quiz-resultado"
        );

    const btnIniciarQuiz =
        document.getElementById(
            "btn-iniciar-quiz"
        );

    const btnProximaQuiz =
        document.getElementById(
            "btn-proxima-quiz"
        );

    const btnRefazerQuiz =
        document.getElementById(
            "btn-refazer-quiz"
        );

    const contadorQuiz =
        document.getElementById(
            "quiz-contador"
        );

    const progressoQuiz =
        document.getElementById(
            "quiz-progresso"
        );

    const categoriaQuiz =
        document.getElementById(
            "quiz-categoria"
        );

    const perguntaQuiz =
        document.getElementById(
            "quiz-pergunta"
        );

    const alternativasQuiz =
        document.getElementById(
            "quiz-alternativas"
        );

    const xpAtualQuiz =
        document.getElementById(
            "quiz-xp"
        );

    const feedbackQuiz =
        document.getElementById(
            "quiz-feedback"
        );

    const feedbackIcone =
        document.getElementById(
            "quiz-feedback-icone"
        );

    const feedbackTitulo =
        document.getElementById(
            "quiz-feedback-titulo"
        );

    const feedbackTexto =
        document.getElementById(
            "quiz-feedback-texto"
        );


    // ========================================
    // INICIAR QUIZ
    // ========================================

    function iniciarQuiz() {

        perguntaAtualQuiz = 0;
        acertosQuiz = 0;
        xpQuiz = 0;
        respondeuQuiz = false;

        introducaoQuiz.classList.add(
            "escondido"
        );

        resultadoQuiz.classList.add(
            "escondido"
        );

        areaQuiz.classList.remove(
            "escondido"
        );

        mostrarPerguntaQuiz();

    }


    // ========================================
    // MOSTRAR PERGUNTA
    // ========================================

    function mostrarPerguntaQuiz() {

        respondeuQuiz = false;

        btnProximaQuiz.disabled = true;

        feedbackQuiz.classList.add(
            "escondido"
        );

        const dadosPergunta =
            perguntasQuiz[
                perguntaAtualQuiz
            ];

        contadorQuiz.textContent =
            `Pergunta ${
                perguntaAtualQuiz + 1
            } de ${
                perguntasQuiz.length
            }`;

        categoriaQuiz.textContent =
            dadosPergunta.categoria;

        perguntaQuiz.textContent =
            dadosPergunta.pergunta;

        xpAtualQuiz.textContent =
            `${xpQuiz} XP`;

        const progresso =
            (
                perguntaAtualQuiz /
                perguntasQuiz.length
            ) * 100;

        progressoQuiz.style.width =
            `${progresso}%`;

        alternativasQuiz.innerHTML = "";

        dadosPergunta.alternativas.forEach(
            (alternativa, indice) => {

                const botao =
                    document.createElement(
                        "button"
                    );

                botao.type = "button";

                botao.classList.add(
                    "quiz-alternativa"
                );

                botao.innerHTML = `

                    <span class="quiz-alternativa-letra">
                        ${
                            String.fromCharCode(
                                65 + indice
                            )
                        }
                    </span>

                    <span>
                        ${alternativa}
                    </span>

                `;

                botao.addEventListener(
                    "click",
                    function () {

                        responderQuiz(
                            indice
                        );

                    }
                );

                alternativasQuiz.appendChild(
                    botao
                );

            }
        );

    }


    // ========================================
    // RESPONDER
    // ========================================

    function responderQuiz(
        indiceEscolhido
    ) {

        if (respondeuQuiz) {
            return;
        }

        respondeuQuiz = true;

        const dadosPergunta =
            perguntasQuiz[
                perguntaAtualQuiz
            ];

        const respostaCorreta =
            dadosPergunta.correta;

        const botoes =
            alternativasQuiz.querySelectorAll(
                ".quiz-alternativa"
            );

        botoes.forEach(
            botao => {

                botao.disabled = true;

            }
        );


        if (
            indiceEscolhido ===
            respostaCorreta
        ) {

            acertosQuiz++;

            // Apenas prévia visual.
            xpQuiz =
                acertosQuiz * 10;

            botoes[
                indiceEscolhido
            ].classList.add(
                "correta"
            );

            mostrarFeedbackQuiz(
                true,
                dadosPergunta.explicacao
            );

        } else {

            botoes[
                indiceEscolhido
            ].classList.add(
                "errada"
            );

            botoes[
                respostaCorreta
            ].classList.add(
                "correta"
            );

            mostrarFeedbackQuiz(
                false,
                dadosPergunta.explicacao
            );

        }


        xpAtualQuiz.textContent =
            `${xpQuiz} XP`;

        btnProximaQuiz.disabled =
            false;


        if (
            perguntaAtualQuiz ===
            perguntasQuiz.length - 1
        ) {

            btnProximaQuiz.textContent =
                "Ver resultado →";

        } else {

            btnProximaQuiz.textContent =
                "Próxima pergunta →";

        }

    }


    // ========================================
    // FEEDBACK
    // ========================================

    function mostrarFeedbackQuiz(
        acertou,
        explicacao
    ) {

        feedbackQuiz.classList.remove(
            "escondido"
        );


        if (acertou) {

            feedbackIcone.textContent =
                "🎉";

            feedbackTitulo.textContent =
                "Muito bem!";

            feedbackTexto.textContent =
                explicacao;

        } else {

            feedbackIcone.textContent =
                "💡";

            feedbackTitulo.textContent =
                "Quase!";

            feedbackTexto.textContent =
                explicacao;

        }

    }


    // ========================================
    // PRÓXIMA PERGUNTA
    // ========================================

    function proximaPerguntaQuiz() {

        if (!respondeuQuiz) {
            return;
        }


        if (
            perguntaAtualQuiz <
            perguntasQuiz.length - 1
        ) {

            perguntaAtualQuiz++;

            mostrarPerguntaQuiz();

        } else {

            finalizarQuiz();

        }

    }


    // ========================================
    // FINALIZAR QUIZ
    // ========================================

    async function finalizarQuiz() {

        areaQuiz.classList.add(
            "escondido"
        );

        resultadoQuiz.classList.remove(
            "escondido"
        );

        progressoQuiz.style.width =
            "100%";

        const erros =
            perguntasQuiz.length -
            acertosQuiz;


        document.getElementById(
            "quiz-total-acertos"
        ).textContent =
            acertosQuiz;


        document.getElementById(
            "quiz-total-erros"
        ).textContent =
            erros;


        // Enquanto espera o backend,
        // não afirmamos que o XP foi recebido.

        const elementoXp =
            document.getElementById(
                "quiz-xp-ganho"
            );

        elementoXp.textContent =
            "Salvando...";


        atualizarMensagemFinal();


        const resultado =
            await concluirAtividade();


        // ========================================
        // RESULTADO DO BACKEND
        // ========================================

        if (!resultado) {

            elementoXp.textContent =
                "Erro ao salvar";

            return;

        }


        if (
            resultado.primeiraConclusao
        ) {

            elementoXp.textContent =
                `+${resultado.xpGanho} XP`;

        } else {

            elementoXp.textContent =
                "0 XP";

        }

    }


    // ========================================
    // MENSAGEM FINAL
    // ========================================

    function atualizarMensagemFinal() {

        const titulo =
            document.getElementById(
                "quiz-mensagem-titulo"
            );

        const texto =
            document.getElementById(
                "quiz-mensagem-texto"
            );

        const emoji =
            document.getElementById(
                "quiz-resultado-emoji"
            );


        if (
            acertosQuiz >= 9
        ) {

            emoji.textContent = "🏆";

            titulo.textContent =
                "Excelente!";

            texto.textContent =
                "Você mandou muito bem e demonstrou ótimo conhecimento sobre sustentabilidade.";

        }

        else if (
            acertosQuiz >= 7
        ) {

            emoji.textContent = "🌟";

            titulo.textContent =
                "Muito bem!";

            texto.textContent =
                "Você está indo muito bem. Continue praticando para chegar ainda mais longe.";

        }

        else if (
            acertosQuiz >= 5
        ) {

            emoji.textContent = "🌱";

            titulo.textContent =
                "Bom trabalho!";

            texto.textContent =
                "Você já sabe bastante, mas ainda pode aprender muitas coisas novas.";

        }

        else {

            emoji.textContent = "💡";

            titulo.textContent =
                "Continue aprendendo!";

            texto.textContent =
                "Cada tentativa é uma oportunidade de aprender mais sobre água, energia e sustentabilidade.";

        }

    }


    // ========================================
    // CONCLUIR ATIVIDADE NO BACKEND
    // ========================================

    async function concluirAtividade() {

        const usuarioSalvo =
            localStorage.getItem(
                "ecoUsuario"
            );


        if (!usuarioSalvo) {

            console.error(
                "Nenhum usuário logado."
            );

            return null;

        }


        try {

            const usuario =
                JSON.parse(
                    usuarioSalvo
                );


            console.log(
                "Enviando conclusão:",
                {
                    usuarioId:
                        usuario.id,

                    atividadeId:
                        ATIVIDADE_ID,

                    acertos:
                        acertosQuiz
                }
            );


            const resposta =
                await fetch(
                    "http://localhost:3000/api/atividade/concluir",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                {

                                    usuarioId:
                                        usuario.id,

                                    atividadeId:
                                        ATIVIDADE_ID,

                                    acertos:
                                        acertosQuiz

                                }
                            )

                    }
                );


            const dados =
                await resposta.json();


            console.log(
                "Resposta da atividade:",
                dados
            );


            if (!resposta.ok) {

                console.error(
                    "Erro ao concluir atividade:",
                    dados.mensagem
                );

                return null;

            }


            // ========================================
            // ATUALIZAR USUÁRIO LOCAL
            // ========================================

            usuario.xp =
                dados.xpTotal;

            usuario.sequencia =
                dados.sequencia;

            usuario.ultimaAtividade =
                dados.ultimaAtividade;


            localStorage.setItem(
                "ecoUsuario",
                JSON.stringify(
                    usuario
                )
            );


            // ========================================
            // LOGS PARA TESTE
            // ========================================

            console.log(
                "XP ganho:",
                dados.xpGanho
            );

            console.log(
                "XP total:",
                dados.xpTotal
            );

            console.log(
                "Sequência:",
                dados.sequencia
            );

            console.log(
                "Primeira conclusão:",
                dados.primeiraConclusao
            );


            return dados;


        } catch (erro) {

            console.error(
                "Erro ao enviar atividade:",
                erro
            );

            return null;

        }

    }


    // ========================================
    // REFAZER QUIZ
    // ========================================

    function refazerQuiz() {

        perguntaAtualQuiz = 0;
        acertosQuiz = 0;
        xpQuiz = 0;
        respondeuQuiz = false;

        resultadoQuiz.classList.add(
            "escondido"
        );

        introducaoQuiz.classList.remove(
            "escondido"
        );

        areaQuiz.classList.add(
            "escondido"
        );

        btnProximaQuiz.textContent =
            "Próxima pergunta →";

    }


    // ========================================
    // EVENTOS
    // ========================================

    if (btnIniciarQuiz) {

        btnIniciarQuiz.addEventListener(
            "click",
            iniciarQuiz
        );

    }


    if (btnProximaQuiz) {

        btnProximaQuiz.addEventListener(
            "click",
            proximaPerguntaQuiz
        );

    }


    if (btnRefazerQuiz) {

        btnRefazerQuiz.addEventListener(
            "click",
            refazerQuiz
        );

    }

})();