/* =========================================
   ECOENERGIA
   TESTE DE NÍVEL
========================================= */


/* =========================================
   PERGUNTAS
========================================= */

const perguntas = [

    /* =====================================
       1 — MUITO FÁCIL
    ===================================== */

    {
        categoria: "💧 MUITO FÁCIL • ECONOMIA DE ÁGUA",

        pergunta:
            "Qual atitude ajuda diretamente a economizar água durante o banho?",

        alternativas: [
            "Deixar o chuveiro ligado enquanto ensaboa o corpo",
            "Tomar banhos mais rápidos e fechar o chuveiro ao se ensaboar",
            "Aumentar a pressão da água",
            "Tomar dois banhos seguidos"
        ],

        correta: 1
    },


    /* =====================================
       2 — MUITO FÁCIL
    ===================================== */

    {
        categoria: "⚡ MUITO FÁCIL • ECONOMIA DE ENERGIA",

        pergunta:
            "Qual destas atitudes evita desperdício de energia elétrica?",

        alternativas: [
            "Deixar as luzes acesas em cômodos vazios",
            "Manter aparelhos ligados durante toda a noite",
            "Desligar aparelhos quando eles não estão sendo utilizados",
            "Deixar o carregador conectado mesmo sem o celular"
        ],

        correta: 2
    },


    /* =====================================
       3 — MÉDIA
    ===================================== */

    {
        categoria: "💧 MÉDIA • CONSUMO DE ÁGUA",

        pergunta:
            "Por que um arejador instalado em uma torneira pode reduzir o consumo de água?",

        alternativas: [
            "Porque aumenta a temperatura da água",
            "Porque mistura ar ao fluxo, mantendo uma sensação de vazão adequada com menor volume de água",
            "Porque transforma água potável em água reutilizável",
            "Porque impede completamente a saída de água"
        ],

        correta: 1
    },


    /* =====================================
       4 — MÉDIA
    ===================================== */

    {
        categoria: "⚡ MÉDIA • EFICIÊNCIA ENERGÉTICA",

        pergunta:
            "Um aparelho elétrico possui potência de 1.000 W e permanece ligado durante 3 horas. Aproximadamente quanta energia ele consome nesse período?",

        alternativas: [
            "0,3 kWh",
            "1 kWh",
            "3 kWh",
            "30 kWh"
        ],

        correta: 2
    },


    /* =====================================
       5 — DIFÍCIL
    ===================================== */

    {
        categoria: "💧 DIFÍCIL • RECURSOS HÍDRICOS",

        pergunta:
            "O que representa o conceito de 'água virtual' associado a um produto?",

        alternativas: [
            "A quantidade de água armazenada fisicamente dentro do produto",
            "A água utilizada direta e indiretamente ao longo da produção de um bem ou serviço",
            "A quantidade de água presente somente na embalagem",
            "A água da chuva que caiu sobre o produto durante sua fabricação"
        ],

        correta: 1
    },


    /* =====================================
       6 — DIFÍCIL
    ===================================== */

    {
        categoria: "⚡ DIFÍCIL • SISTEMAS ELÉTRICOS",

        pergunta:
            "Por que corrigir um baixo fator de potência em uma instalação elétrica pode melhorar a eficiência do sistema?",

        alternativas: [
            "Porque aumenta automaticamente a tensão disponível para todos os aparelhos",
            "Porque pode reduzir a circulação de corrente necessária para fornecer a mesma potência ativa, diminuindo perdas no sistema",
            "Porque elimina completamente o consumo de energia ativa",
            "Porque faz os equipamentos funcionarem sem corrente elétrica"
        ],

        correta: 1
    },


    /* =====================================
       7 — IMPOSSÍVEL
    ===================================== */

    {
        categoria: "🔥 IMPOSSÍVEL • HIDROLOGIA",

        pergunta:
            "Em uma bacia hidrográfica, qual efeito pode ocorrer quando uma grande área de vegetação nativa é substituída por superfícies impermeáveis?",

        alternativas: [
            "Aumento da infiltração e redução do escoamento superficial",
            "Redução do escoamento superficial e aumento da recarga natural",
            "Aumento do escoamento superficial, redução da infiltração e potencial aumento de picos de vazão",
            "Nenhuma alteração relevante no comportamento hidrológico"
        ],

        correta: 2
    },


    /* =====================================
       8 — IMPOSSÍVEL
    ===================================== */

    {
        categoria: "🔥 IMPOSSÍVEL • ENERGIA SOLAR",

        pergunta:
            "Em um sistema fotovoltaico conectado à rede, qual situação normalmente provoca a redução da potência gerada por um conjunto de módulos mesmo quando a irradiância solar é elevada?",

        alternativas: [
            "Aumento da eficiência dos módulos",
            "Sombreamento parcial de módulos ou células do conjunto",
            "Redução da temperatura dos módulos",
            "Limpeza adequada dos painéis"
        ],

        correta: 1
    },


    /* =====================================
       9 — TÉCNICO AVANÇADO
    ===================================== */

    {
        categoria:
            "🧠 TÉCNICO AVANÇADO • ENGENHARIA ENERGÉTICA",

        pergunta:
            "Em um sistema elétrico trifásico equilibrado, uma carga possui potência ativa de 15 kW, fator de potência 0,75 e tensão de linha de 380 V. Aproximadamente qual é a corrente de linha?",

        alternativas: [
            "15,2 A",
            "30,4 A",
            "45,6 A",
            "57,0 A"
        ],

        correta: 1
    },


    /* =====================================
       10 — TÉCNICO AVANÇADO
    ===================================== */

    {
        categoria:
            "🧠 TÉCNICO AVANÇADO • EFICIÊNCIA HÍDRICA",

        pergunta:
            "Em um sistema de bombeamento de água, mantendo vazão e características do fluido constantes, qual alteração tende a reduzir significativamente o consumo de energia quando o sistema permite controle adequado da rotação da bomba?",

        alternativas: [
            "Aumentar a rotação da bomba acima da necessidade",
            "Utilizar um inversor de frequência para ajustar a rotação conforme a demanda",
            "Manter a bomba sempre operando em sua rotação máxima",
            "Instalar uma válvula parcialmente fechada e manter a bomba em rotação máxima"
        ],

        correta: 1
    }

];


/* =========================================
   VARIÁVEIS
========================================= */

let perguntaAtual = 0;
let acertos = 0;
let respondeu = false;


/* =========================================
   ELEMENTOS HTML
========================================= */

const introducao =
    document.getElementById("introducao-teste");

const areaTeste =
    document.getElementById("area-teste");

const resultado =
    document.getElementById("resultado-teste");

const btnIniciar =
    document.getElementById("btn-iniciar-teste");

const btnProxima =
    document.getElementById("btn-proxima");

const btnRefazer =
    document.getElementById("btn-refazer");

const perguntaElemento =
    document.getElementById("pergunta");

const alternativasElemento =
    document.getElementById("alternativas");

const categoriaElemento =
    document.getElementById("categoria-pergunta");

const numeroPerguntaElemento =
    document.getElementById("numero-pergunta");

const contadorAcertosElemento =
    document.getElementById("contador-acertos");

const progressoElemento =
    document.getElementById("progresso");

const feedbackElemento =
    document.getElementById("feedback");


/* =========================================
   INICIAR TESTE
========================================= */

btnIniciar.addEventListener(
    "click",
    iniciarTeste
);


function iniciarTeste() {

    perguntaAtual = 0;

    acertos = 0;

    respondeu = false;

    introducao.classList.add(
        "escondido"
    );

    resultado.classList.add(
        "escondido"
    );

    areaTeste.classList.remove(
        "escondido"
    );

    mostrarPergunta();
}


/* =========================================
   MOSTRAR PERGUNTA
========================================= */

function mostrarPergunta() {

    respondeu = false;

    const pergunta =
        perguntas[perguntaAtual];


    /* Número da pergunta */

    numeroPerguntaElemento.textContent =
        `Pergunta ${perguntaAtual + 1} de ${perguntas.length}`;


    /* Contador */

    contadorAcertosElemento.textContent =
        `${acertos} ${acertos === 1
            ? "acerto"
            : "acertos"
        }`;


    /* Barra de progresso */

    const progresso =
        (
            perguntaAtual /
            perguntas.length
        ) * 100;

    progressoElemento.style.width =
        `${progresso}%`;


    /* Categoria */

    categoriaElemento.textContent =
        pergunta.categoria;


    /* Pergunta */

    perguntaElemento.textContent =
        pergunta.pergunta;


    /* Limpar alternativas */

    alternativasElemento.innerHTML =
        "";


    /* Esconder feedback */

    feedbackElemento.classList.add(
        "escondido"
    );

    feedbackElemento.innerHTML =
        "";


    /* Esconder botão */

    btnProxima.classList.add(
        "escondido"
    );


    /* Criar alternativas */

    pergunta.alternativas.forEach(
        (alternativa, indice) => {

            const botao =
                document.createElement(
                    "button"
                );

            botao.classList.add(
                "alternativa"
            );

            botao.innerHTML = `
                <span class="letra-alternativa">
                    ${String.fromCharCode(
                        65 + indice
                    )}
                </span>

                <span>
                    ${alternativa}
                </span>
            `;

            botao.addEventListener(
                "click",
                () =>
                    selecionarResposta(
                        indice
                    )
            );

            alternativasElemento
                .appendChild(botao);
        }
    );


    /* Animação */

    const perguntaContainer =
        document.getElementById(
            "pergunta-container"
        );

    if (perguntaContainer) {

        perguntaContainer.classList.remove(
            "trocar-pergunta"
        );

        void perguntaContainer.offsetWidth;

        perguntaContainer.classList.add(
            "trocar-pergunta"
        );
    }
}


/* =========================================
   SELECIONAR RESPOSTA
========================================= */

function selecionarResposta(
    indiceEscolhido
) {

    if (respondeu) {
        return;
    }

    respondeu = true;


    const pergunta =
        perguntas[perguntaAtual];


    const botoes =
        document.querySelectorAll(
            ".alternativa"
        );


    /* Desabilitar todos */

    botoes.forEach(botao => {

        botao.disabled = true;
    });


    /* Resposta correta */

    const respostaCorreta =
        pergunta.correta;


    /* Verificar resposta */

    if (
        indiceEscolhido ===
        respostaCorreta
    ) {

        acertos++;

        botoes[indiceEscolhido]
            .classList.add(
                "correta"
            );


        mostrarFeedback(
            true,
            "🎉 Muito bem! Você acertou!"
        );

    } else {

        botoes[indiceEscolhido]
            .classList.add(
                "incorreta"
            );

        botoes[respostaCorreta]
            .classList.add(
                "correta"
            );


        mostrarFeedback(
            false,
            "💡 Quase! A resposta correta foi destacada em verde."
        );
    }


    /* Atualizar contador */

    contadorAcertosElemento.textContent =
        `${acertos} ${acertos === 1
            ? "acerto"
            : "acertos"
        }`;


    /* Mostrar botão */

    btnProxima.classList.remove(
        "escondido"
    );


    /* Última pergunta */

    if (
        perguntaAtual ===
        perguntas.length - 1
    ) {

        btnProxima.textContent =
            "Ver meu resultado 🏆";
    }
}


/* =========================================
   FEEDBACK
========================================= */

function mostrarFeedback(
    acertou,
    mensagem
) {

    feedbackElemento.classList.remove(
        "escondido"
    );


    feedbackElemento.className =
        acertou
            ? "feedback feedback-correto"
            : "feedback feedback-erro";


    feedbackElemento.innerHTML =
        mensagem;
}


/* =========================================
   PRÓXIMA PERGUNTA
========================================= */

btnProxima.addEventListener(
    "click",
    proximaPergunta
);


function proximaPergunta() {

    perguntaAtual++;


    /* Ainda existem perguntas */

    if (
        perguntaAtual <
        perguntas.length
    ) {

        mostrarPergunta();

        return;
    }


    /* Acabaram as perguntas */

    finalizarTeste();
}


/* =========================================
   FINALIZAR TESTE
========================================= */

function finalizarTeste() {

    areaTeste.classList.add(
        "escondido"
    );

    resultado.classList.remove(
        "escondido"
    );


    /* Barra completa */

    progressoElemento.style.width =
        "100%";


    /* Mostrar pontuação */

    document
        .getElementById(
            "pontuacao"
        )
        .textContent =
        acertos;


    document
        .getElementById(
            "texto-acertos"
        )
        .textContent =
        `Você acertou ${acertos} de ${perguntas.length} perguntas.`;


    /* Descobrir nível */

    const nivel =
        descobrirNivel(acertos);


    /* Mostrar nível */

    document
        .getElementById(
            "nivel-icone"
        )
        .textContent =
        nivel.icone;


    document
        .getElementById(
            "nivel-nome"
        )
        .textContent =
        nivel.nome;


    document
        .getElementById(
            "nivel-descricao"
        )
        .textContent =
        nivel.descricao;


    /* Emoji */

    document
        .getElementById(
            "resultado-emoji"
        )
        .textContent =
        nivel.emoji;


    /* Salvar resultado */

    const dadosNivel = {

        nivel:
            nivel.nome,

        icone:
            nivel.icone,

        acertos:
            acertos,

        total:
            perguntas.length
    };


    localStorage.setItem(
        "ecoNivel",
        JSON.stringify(
            dadosNivel
        )
    );


    /* Confetes */

    if (
        typeof comemorar ===
        "function"
    ) {

        comemorar();
    }
}


/* =========================================
   DEFINIR NÍVEL
========================================= */

function descobrirNivel(pontos) {

    if (pontos <= 2) {

        return {

            nome:
                "Iniciante",

            icone:
                "🌱",

            emoji:
                "🌱",

            descricao:
                "Você está começando sua jornada! Continue aprendendo e descubra novas formas de cuidar da água e da energia."
        };
    }


    if (pontos <= 4) {

        return {

            nome:
                "Explorador",

            icone:
                "💧",

            emoji:
                "💧",

            descricao:
                "Você já conhece alguns conceitos importantes. Agora é hora de explorar ainda mais o mundo da sustentabilidade!"
        };
    }


    if (pontos <= 6) {

        return {

            nome:
                "Intermediário",

            icone:
                "⚡",

            emoji:
                "⚡",

            descricao:
                "Muito bom! Você possui uma boa base sobre economia de água e energia. Continue praticando!"
        };
    }


    if (pontos <= 8) {

        return {

            nome:
                "Avançado",

            icone:
                "🌿",

            emoji:
                "🌿",

            descricao:
                "Excelente! Você já possui bastante conhecimento sobre sustentabilidade e consumo consciente."
        };
    }


    return {

        nome:
            "Especialista",

        icone:
            "🌎",

        emoji:
            "🏆",

        descricao:
            "Incrível! Você domina os principais conceitos de economia de água e energia. Agora pode encarar desafios ainda maiores!"
    };
}


/* =========================================
   REFAZER TESTE
========================================= */

btnRefazer.addEventListener(
    "click",
    refazerTeste
);


function refazerTeste() {

    perguntaAtual = 0;

    acertos = 0;

    respondeu = false;


    resultado.classList.add(
        "escondido"
    );

    introducao.classList.remove(
        "escondido"
    );

    areaTeste.classList.add(
        "escondido"
    );


    btnProxima.textContent =
        "Próxima pergunta →";
}