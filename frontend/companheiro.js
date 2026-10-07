"use strict";

// ========================================
// ELEMENTOS
// ========================================

const etapaTexto =
    document.getElementById("companheiro-etapa");

const titulo =
    document.getElementById("companheiro-titulo");

const descricao =
    document.getElementById("companheiro-descricao");

const opcoes =
    document.querySelector(".companheiro-opcoes");

const previewCompanheiro =
    document.getElementById("preview-companheiro");

const previewNome =
    document.getElementById("preview-nome");

const botaoSelecionar =
    document.getElementById("btn-selecionar-especie");


// ========================================
// DADOS DO COMPANHEIRO
// ========================================

const companheiro = {

    especie: null,

    corPrincipal: null,

    corSecundaria: null,

    olhos: null,

    expressao: null,

    nome: null

};


let opcaoTemporaria = null;

let etapaAtual = 1;


// ========================================
// ESPÉCIES
// ========================================

const especies = {

    brotim: {

        nome: "Brotim",

        imagem:
            "imagens/personagens/brotim/brotim.png",

        svg:
            "imagens/personagens/brotim/brotim.svg"

    },


    gotim: {

        nome: "Gotim",

        imagem:
            "imagens/personagens/gotim/gotim.png",

        svg:
            "imagens/personagens/gotim/gotim.svg"

    },


    faisquinha: {

        nome: "Faisquinha",

        imagem:
            "imagens/personagens/faisquinha/faisquinha.png",

        svg:
            "imagens/personagens/faisquinha/faisquinha.svg"

    }

};


// ========================================
// CORES PRINCIPAIS
// ========================================

const coresPrincipais = {

    azul:
        "#4AA3FF",

    verde:
        "#9CE82A",

    amarelo:
        "#FFD83D",

    roxo:
        "#9B63F4",

    rosa:
        "#FF77B7",

    laranja:
        "#FF9846"

};


// ========================================
// CORES SECUNDÁRIAS
// ========================================

const coresSecundarias = {

    claro:
        "#F8F8F2",

    turquesa:
        "#56D6D2",

    amarelo:
        "#FFE66D",

    creme:
        "#FFF0C9"

};


// ========================================
// PEGAR SVG DO PREVIEW
// ========================================

function obterSvgPreview() {

    return previewCompanheiro
        .querySelector("svg");

}


// ========================================
// VERIFICA SE A ESPÉCIE USA SVG
// ========================================

function personagemAtualUsaSvg() {

    return Boolean(

        companheiro.especie &&

        especies[
            companheiro.especie
        ] &&

        especies[
            companheiro.especie
        ].svg

    );

}


// ========================================
// COR PRINCIPAL
// BROTIM + GOTIM + FAISQUINHA
// ========================================

function aplicarCorPrincipalNoPreview(
    corId
) {

    const cor =
        coresPrincipais[
            corId
        ];


    if (!cor) {

        return;

    }


    const svg =
        obterSvgPreview();


    if (!svg) {

        return;

    }


    svg.style.setProperty(
        "--cor-principal",
        cor
    );


    const partesPrincipais =
        svg.querySelectorAll(
            '[fill*="--cor-principal"]'
        );


    partesPrincipais.forEach(
        parte => {

            parte.style.fill =
                cor;

        }
    );


    console.log(
        "COR PRINCIPAL ALTERADA:",
        corId,
        cor,
        "Partes:",
        partesPrincipais.length
    );

}


// ========================================
// COR SECUNDÁRIA
// BROTIM + GOTIM + FAISQUINHA
// ========================================

function aplicarCorSecundariaNoPreview(
    corId
) {

    const cor =
        coresSecundarias[
            corId
        ];


    if (!cor) {

        return;

    }


    const svg =
        obterSvgPreview();


    if (!svg) {

        return;

    }


    svg.style.setProperty(
        "--cor-secundaria",
        cor
    );


    const partesSecundarias =
        svg.querySelectorAll(
            '[fill*="--cor-secundaria"]'
        );


    partesSecundarias.forEach(
        parte => {

            parte.style.fill =
                cor;

        }
    );


    console.log(
        "COR SECUNDÁRIA ALTERADA:",
        corId,
        cor,
        "Partes:",
        partesSecundarias.length
    );

}


// ========================================
// OLHOS
// BROTIM + GOTIM + FAISQUINHA
// ========================================

function aplicarOlhosNoPreview(
    tipo
) {

    const svg =
        obterSvgPreview();


    if (!svg) {

        return;

    }


    const grupos = {

        redondos:
            svg.querySelector(
                "#olhos-redondos"
            ),

        grandes:
            svg.querySelector(
                "#olhos-grandes"
            ),

        brilhantes:
            svg.querySelector(
                "#olhos-brilhantes"
            )

    };


    Object.values(
        grupos
    ).forEach(

        grupo => {

            if (!grupo) {

                return;

            }


            grupo.setAttribute(
                "display",
                "none"
            );


            grupo.style.display =
                "none";

        }

    );


    const escolhido =
        grupos[
            tipo
        ];


    if (!escolhido) {

        console.error(
            "Grupo de olhos não encontrado:",
            tipo
        );

        return;

    }


    escolhido.removeAttribute(
        "display"
    );


    escolhido.style.removeProperty(
        "display"
    );


    console.log(
        "OLHOS ALTERADOS:",
        tipo
    );

}


// ========================================
// EXPRESSÃO
// BROTIM + GOTIM + FAISQUINHA
// ========================================

function aplicarExpressaoNoPreview(
    tipo
) {

    const svg =
        obterSvgPreview();


    if (!svg) {

        return;

    }


    const grupos = {

        sorriso:
            svg.querySelector(
                "#expressao-sorriso"
            ),

        animado:
            svg.querySelector(
                "#expressao-animado"
            ),

        curioso:
            svg.querySelector(
                "#expressao-curioso"
            )

    };


    Object.values(
        grupos
    ).forEach(

        grupo => {

            if (!grupo) {

                return;

            }


            grupo.setAttribute(
                "display",
                "none"
            );


            grupo.style.display =
                "none";

        }

    );


    const escolhida =
        grupos[
            tipo
        ];


    if (!escolhida) {

        console.error(
            "Grupo de expressão não encontrado:",
            tipo
        );

        return;

    }


    escolhida.removeAttribute(
        "display"
    );


    escolhida.style.removeProperty(
        "display"
    );


    // ========================================
    // SOBRANCELHAS DO GOTIM
    // ========================================

    const sobrancelhasBase =
        svg.querySelector(
            "#sobrancelhas-base"
        );


    if (sobrancelhasBase) {

        if (
            tipo === "sorriso"
        ) {

            sobrancelhasBase
                .removeAttribute(
                    "display"
                );


            sobrancelhasBase
                .style
                .removeProperty(
                    "display"
                );

        } else {

            sobrancelhasBase
                .setAttribute(
                    "display",
                    "none"
                );


            sobrancelhasBase
                .style
                .display =
                "none";

        }

    }


    console.log(
        "EXPRESSÃO ALTERADA:",
        tipo
    );

}


// ========================================
// REAPLICAR TODA PERSONALIZAÇÃO
// ========================================

function reaplicarPersonalizacao() {

    if (
        !personagemAtualUsaSvg()
    ) {

        return;

    }


    if (
        companheiro.corPrincipal
    ) {

        aplicarCorPrincipalNoPreview(
            companheiro.corPrincipal
        );

    }


    if (
        companheiro.corSecundaria
    ) {

        aplicarCorSecundariaNoPreview(
            companheiro.corSecundaria
        );

    }


    if (
        companheiro.olhos
    ) {

        aplicarOlhosNoPreview(
            companheiro.olhos
        );

    }


    if (
        companheiro.expressao
    ) {

        aplicarExpressaoNoPreview(
            companheiro.expressao
        );

    }

}


// ========================================
// MOSTRAR PERSONAGEM
// ========================================

async function mostrarImagemCompanheiro(
    especieId
) {

    const especie =
        especies[
            especieId
        ];


    if (!especie) {

        console.error(
            "Espécie inválida:",
            especieId
        );

        return;

    }


    // ========================================
    // SVG DINÂMICO
    // BROTIM + GOTIM + FAISQUINHA
    // ========================================

    if (
        especie.svg
    ) {

        try {

            const resposta =
                await fetch(
                    especie.svg,
                    {

                        cache:
                            "no-store"

                    }
                );


            if (
                !resposta.ok
            ) {

                throw new Error(
                    `Não foi possível carregar ${especie.svg}.`
                );

            }


            const svg =
                await resposta.text();


            previewCompanheiro
                .innerHTML =
                svg;


            previewNome
                .textContent =
                especie.nome;


            if (
                especieId ===
                companheiro.especie
            ) {

                reaplicarPersonalizacao();

            }


            return;


        } catch (erro) {

            console.error(
                "Erro ao carregar SVG:",
                erro
            );

        }

    }


    // ========================================
    // FALLBACK PNG
    // ========================================

    previewCompanheiro.innerHTML = `

        <img
            src="${especie.imagem}"
            alt="${especie.nome}"
            class="preview-personagem-imagem"
        >

    `;


    previewNome.textContent =
        especie.nome;

}


// ========================================
// ATIVAR OPÇÕES
// ========================================

function ativarOpcoes() {

    const botoes =
        opcoes.querySelectorAll(
            "[data-valor]"
        );


    botoes.forEach(

        botao => {

            botao.addEventListener(

                "click",

                async () => {


                    botoes.forEach(

                        item => {

                            item
                                .classList
                                .remove(
                                    "selecionada"
                                );

                        }

                    );


                    botao.classList.add(
                        "selecionada"
                    );


                    opcaoTemporaria =
                        botao.dataset.valor;


                    botaoSelecionar.disabled =
                        false;


                    // ========================================
                    // ETAPA 1
                    // ========================================

                    if (
                        etapaAtual === 1
                    ) {

                        await mostrarImagemCompanheiro(
                            opcaoTemporaria
                        );


                        return;

                    }


                    // ========================================
                    // ETAPA 2
                    // ========================================

                    if (
                        etapaAtual === 2
                    ) {

                        aplicarCorPrincipalNoPreview(
                            opcaoTemporaria
                        );


                        previewNome.textContent =
                            `${especies[companheiro.especie].nome} • ${opcaoTemporaria}`;


                        return;

                    }


                    // ========================================
                    // ETAPA 3
                    // ========================================

                    if (
                        etapaAtual === 3
                    ) {

                        aplicarCorSecundariaNoPreview(
                            opcaoTemporaria
                        );


                        previewNome.textContent =
                            `${especies[companheiro.especie].nome} • ${companheiro.corPrincipal} + ${opcaoTemporaria}`;


                        return;

                    }


                    // ========================================
                    // ETAPA 4
                    // ========================================

                    if (
                        etapaAtual === 4
                    ) {

                        aplicarOlhosNoPreview(
                            opcaoTemporaria
                        );


                        previewNome.textContent =
                            `${especies[companheiro.especie].nome} • olhos ${opcaoTemporaria}`;


                        return;

                    }


                    // ========================================
                    // ETAPA 5
                    // ========================================

                    if (
                        etapaAtual === 5
                    ) {

                        aplicarExpressaoNoPreview(
                            opcaoTemporaria
                        );


                        previewNome.textContent =
                            `${especies[companheiro.especie].nome} • ${opcaoTemporaria}`;


                        return;

                    }

                }

            );

        }

    );

}


// ========================================
// ETAPA 1
// ESPÉCIE
// ========================================

function mostrarEtapaEspecie() {

    etapaAtual = 1;

    opcaoTemporaria =
        null;


    etapaTexto.textContent =
        "Etapa 1 de 7";


    titulo.textContent =
        "Escolha seu companheiro";


    descricao.textContent =
        "Ele vai acompanhar você durante toda a sua jornada!";


    botaoSelecionar.textContent =
        "Selecionar";


    botaoSelecionar.disabled =
        true;


    opcoes.innerHTML = `

        <button
            type="button"
            class="opcao-especie"
            data-valor="brotim"
        >

            <img
                src="imagens/personagens/brotim/brotim.png"
                alt="Brotim"
                class="especie-icone"
            >

            <strong>
                Brotim
            </strong>

            <small>
                Amigo da natureza
            </small>

        </button>


        <button
            type="button"
            class="opcao-especie"
            data-valor="gotim"
        >

            <img
                src="imagens/personagens/gotim/gotim.png"
                alt="Gotim"
                class="especie-icone"
            >

            <strong>
                Gotim
            </strong>

            <small>
                Amigo das águas
            </small>

        </button>


        <button
            type="button"
            class="opcao-especie"
            data-valor="faisquinha"
        >

            <img
                src="imagens/personagens/faisquinha/faisquinha.png"
                alt="Faisquinha"
                class="especie-icone"
            >

            <strong>
                Faisquinha
            </strong>

            <small>
                Cheio de energia
            </small>

        </button>

    `;


    ativarOpcoes();

}


// ========================================
// ETAPA 2
// COR PRINCIPAL
// ========================================

function mostrarEtapaCorPrincipal() {

    etapaAtual = 2;

    opcaoTemporaria =
        null;


    etapaTexto.textContent =
        "Etapa 2 de 7";


    titulo.textContent =
        "Escolha a cor principal";


    descricao.textContent =
        "Experimente várias cores antes de escolher!";


    botaoSelecionar.disabled =
        true;


    opcoes.innerHTML = `

        <button
            type="button"
            data-valor="azul"
        >
            🔵

            <strong>
                Azul
            </strong>
        </button>


        <button
            type="button"
            data-valor="verde"
        >
            🟢

            <strong>
                Verde
            </strong>
        </button>


        <button
            type="button"
            data-valor="amarelo"
        >
            🟡

            <strong>
                Amarelo
            </strong>
        </button>


        <button
            type="button"
            data-valor="roxo"
        >
            🟣

            <strong>
                Roxo
            </strong>
        </button>


        <button
            type="button"
            data-valor="rosa"
        >
            🌸

            <strong>
                Rosa
            </strong>
        </button>


        <button
            type="button"
            data-valor="laranja"
        >
            🟠

            <strong>
                Laranja
            </strong>
        </button>

    `;


    ativarOpcoes();

}


// ========================================
// ETAPA 3
// COR SECUNDÁRIA
// ========================================

function mostrarEtapaCorSecundaria() {

    etapaAtual = 3;

    opcaoTemporaria =
        null;


    etapaTexto.textContent =
        "Etapa 3 de 7";


    titulo.textContent =
        "Escolha a cor secundária";


    descricao.textContent =
        "Essa cor vai aparecer nos detalhes do seu companheiro!";


    botaoSelecionar.disabled =
        true;


    opcoes.innerHTML = `

        <button
            type="button"
            data-valor="claro"
        >
            ⚪

            <strong>
                Claro
            </strong>
        </button>


        <button
            type="button"
            data-valor="turquesa"
        >
            🩵

            <strong>
                Turquesa
            </strong>
        </button>


        <button
            type="button"
            data-valor="amarelo"
        >
            🟡

            <strong>
                Amarelo
            </strong>
        </button>


        <button
            type="button"
            data-valor="creme"
        >
            🤍

            <strong>
                Creme
            </strong>
        </button>

    `;


    ativarOpcoes();

}


// ========================================
// ETAPA 4
// OLHOS
// ========================================

function mostrarEtapaOlhos() {

    etapaAtual = 4;

    opcaoTemporaria =
        null;


    etapaTexto.textContent =
        "Etapa 4 de 7";


    titulo.textContent =
        "Escolha os olhos";


    descricao.textContent =
        "Escolha o olhar que combina mais com seu companheiro!";


    botaoSelecionar.disabled =
        true;


    opcoes.innerHTML = `

        <button
            type="button"
            data-valor="redondos"
        >
            👀

            <strong>
                Redondos
            </strong>
        </button>


        <button
            type="button"
            data-valor="grandes"
        >
            🥺

            <strong>
                Grandes
            </strong>
        </button>


        <button
            type="button"
            data-valor="brilhantes"
        >
            ✨

            <strong>
                Brilhantes
            </strong>
        </button>

    `;


    ativarOpcoes();

}


// ========================================
// ETAPA 5
// EXPRESSÃO
// ========================================

function mostrarEtapaExpressao() {

    etapaAtual = 5;

    opcaoTemporaria =
        null;


    etapaTexto.textContent =
        "Etapa 5 de 7";


    titulo.textContent =
        "Escolha a expressão";


    descricao.textContent =
        "Escolha a expressão que mais combina com seu companheiro!";


    botaoSelecionar.disabled =
        true;


    opcoes.innerHTML = `

        <button
            type="button"
            data-valor="sorriso"
        >
            🙂

            <strong>
                Sorriso
            </strong>
        </button>


        <button
            type="button"
            data-valor="animado"
        >
            😄

            <strong>
                Animado
            </strong>
        </button>


        <button
            type="button"
            data-valor="curioso"
        >
            🤔

            <strong>
                Curioso
            </strong>
        </button>

    `;


    ativarOpcoes();

}


// ========================================
// ETAPA 6
// NOME
// ========================================

function mostrarEtapaNome() {

    etapaAtual = 6;

    opcaoTemporaria =
        null;


    etapaTexto.textContent =
        "Etapa 6 de 7";


    titulo.textContent =
        "Dê um nome ao seu companheiro";


    descricao.textContent =
        "Escolha um nome especial para acompanhar você na jornada!";


    botaoSelecionar.disabled =
        true;


    opcoes.innerHTML = `

        <div
            class="campo-nome-companheiro"
        >

            <input
                type="text"
                id="nome-companheiro"
                maxlength="12"
                placeholder="Digite o nome"
                autocomplete="off"
            >

            <small>
                Máximo de 12 caracteres
            </small>

        </div>

    `;


    const campoNome =
        document.getElementById(
            "nome-companheiro"
        );


    campoNome.addEventListener(

        "input",

        () => {


            const nome =
                campoNome.value
                    .trim()
                    .replace(
                        /\s+/g,
                        " "
                    );


            opcaoTemporaria =
                nome;


            botaoSelecionar.disabled =
                nome.length === 0;


            if (
                nome
            ) {

                previewNome.textContent =
                    nome;

            } else {

                previewNome.textContent =
                    especies[
                        companheiro.especie
                    ].nome;

            }

        }

    );

}


// ========================================
// ETAPA 7
// REVISÃO FINAL
// ========================================

async function mostrarEtapaRevisao() {

    etapaAtual = 7;

    opcaoTemporaria =
        null;


    etapaTexto.textContent =
        "Etapa 7 de 7";


    titulo.textContent =
        "Este é o seu companheiro?";


    descricao.textContent =
        "Confira suas escolhas antes de começar a jornada!";


    const especie =
        especies[
            companheiro.especie
        ];


    await mostrarImagemCompanheiro(
        companheiro.especie
    );


    reaplicarPersonalizacao();


    previewNome.textContent =
        companheiro.nome;


    opcoes.innerHTML = `

        <div
            class="resumo-companheiro"
        >

            <p>
                <strong>
                    Nome:
                </strong>

                ${companheiro.nome}
            </p>


            <p>
                <strong>
                    Espécie:
                </strong>

                ${especie.nome}
            </p>


            <p>
                <strong>
                    Cor principal:
                </strong>

                ${companheiro.corPrincipal}
            </p>


            <p>
                <strong>
                    Cor secundária:
                </strong>

                ${companheiro.corSecundaria}
            </p>


            <p>
                <strong>
                    Olhos:
                </strong>

                ${companheiro.olhos}
            </p>


            <p>
                <strong>
                    Expressão:
                </strong>

                ${companheiro.expressao}
            </p>


            <button
                type="button"
                id="btn-alterar-companheiro"
            >
                Quero mudar alguma coisa
            </button>

        </div>

    `;


    botaoSelecionar.textContent =
        "Este é meu companheiro!";


    botaoSelecionar.disabled =
        false;


    const botaoAlterar =
        document.getElementById(
            "btn-alterar-companheiro"
        );


    botaoAlterar.addEventListener(

        "click",

        () => {

            botaoSelecionar.textContent =
                "Selecionar";


            mostrarEtapaEspecie();

        }

    );

}


// ========================================
// SALVAR COMPANHEIRO
// ========================================

async function salvarCompanheiro() {

    botaoSelecionar.disabled =
        true;


    botaoSelecionar.textContent =
        "Criando companheiro...";


    try {

        const resposta =
            await fetch(

                "/api/companheiro",

                {

                    method:
                        "POST",

                    credentials:
                        "include",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            nome:
                                companheiro.nome,

                            especie:
                                companheiro.especie,

                            corPrincipal:
                                companheiro.corPrincipal,

                            corSecundaria:
                                companheiro.corSecundaria,

                            olhos:
                                companheiro.olhos,

                            expressao:
                                companheiro.expressao

                        })

                }

            );


        const dados =
            await resposta
                .json()
                .catch(
                    () => ({})
                );


        if (
            !resposta.ok
        ) {

            console.error(
                "Erro ao criar companheiro:",
                dados
            );


            alert(
                dados.mensagem ||
                "Não foi possível criar seu companheiro."
            );


            botaoSelecionar.disabled =
                false;


            botaoSelecionar.textContent =
                "Este é meu companheiro!";


            return;

        }


        console.log(
            "Companheiro criado com sucesso:",
            dados.companheiro
        );


        mostrarCadastroConcluido();


    } catch (erro) {

        console.error(
            "Erro ao conectar com o servidor:",
            erro
        );


        alert(
            "Não foi possível conectar ao servidor."
        );


        botaoSelecionar.disabled =
            false;


        botaoSelecionar.textContent =
            "Este é meu companheiro!";

    }

}


// ========================================
// CADASTRO CONCLUÍDO
// ========================================

function mostrarCadastroConcluido() {

    etapaAtual = 8;

    opcaoTemporaria =
        null;


    etapaTexto.textContent =
        "Tudo pronto!";


    titulo.textContent =
        "Seu companheiro está pronto! 🎉";


    descricao.textContent =
        `${companheiro.nome} agora vai acompanhar você pela EcoEnergia!`;


    opcoes.innerHTML = `

        <div
            class="companheiro-concluido"
        >

            <h2>
                Bem-vindo,
                ${companheiro.nome}! 🌱
            </h2>

            <p>
                Sua jornada está pronta para começar.
            </p>

        </div>

    `;


    previewNome.textContent =
        companheiro.nome;


    botaoSelecionar.textContent =
        "Começar minha jornada";


    botaoSelecionar.disabled =
        false;

}


// ========================================
// BOTÃO PRINCIPAL
// ========================================

botaoSelecionar.addEventListener(

    "click",

    async () => {


        // ========================================
        // ETAPA 7
        // ========================================

        if (
            etapaAtual === 7
        ) {

            await salvarCompanheiro();


            return;

        }


        // ========================================
        // ETAPA 8
        // ========================================

        if (
            etapaAtual === 8
        ) {

            window.location.href =
                "index.html";


            return;

        }


        if (
            !opcaoTemporaria
        ) {

            return;

        }


        // ========================================
        // ETAPA 1
        // ========================================

        if (
            etapaAtual === 1
        ) {

            const novaEspecie =
                opcaoTemporaria;


            if (

                companheiro.especie &&

                companheiro.especie !==
                novaEspecie

            ) {

                companheiro.corPrincipal =
                    null;

                companheiro.corSecundaria =
                    null;

                companheiro.olhos =
                    null;

                companheiro.expressao =
                    null;

                companheiro.nome =
                    null;

            }


            companheiro.especie =
                novaEspecie;


            console.log(
                "Espécie:",
                companheiro.especie
            );


            mostrarEtapaCorPrincipal();


            return;

        }


        // ========================================
        // ETAPA 2
        // ========================================

        if (
            etapaAtual === 2
        ) {

            companheiro.corPrincipal =
                opcaoTemporaria;


            console.log(
                "Cor principal:",
                companheiro.corPrincipal
            );


            mostrarEtapaCorSecundaria();


            return;

        }


        // ========================================
        // ETAPA 3
        // ========================================

        if (
            etapaAtual === 3
        ) {

            companheiro.corSecundaria =
                opcaoTemporaria;


            console.log(
                "Cor secundária:",
                companheiro.corSecundaria
            );


            mostrarEtapaOlhos();


            return;

        }


        // ========================================
        // ETAPA 4
        // ========================================

        if (
            etapaAtual === 4
        ) {

            companheiro.olhos =
                opcaoTemporaria;


            console.log(
                "Olhos:",
                companheiro.olhos
            );


            mostrarEtapaExpressao();


            return;

        }


        // ========================================
        // ETAPA 5
        // ========================================

        if (
            etapaAtual === 5
        ) {

            companheiro.expressao =
                opcaoTemporaria;


            console.log(
                "Expressão:",
                companheiro.expressao
            );


            mostrarEtapaNome();


            return;

        }


        // ========================================
        // ETAPA 6
        // ========================================

        if (
            etapaAtual === 6
        ) {

            companheiro.nome =
                opcaoTemporaria;


            console.log(
                "Nome:",
                companheiro.nome
            );


            console.log(
                "Companheiro completo:",
                companheiro
            );


            await mostrarEtapaRevisao();


            return;

        }

    }

);


// ========================================
// INICIAR PÁGINA
// ========================================

async function iniciarCriacaoCompanheiro() {

    try {

        const resposta =
            await fetch(

                "/api/companheiro",

                {

                    credentials:
                        "include",

                    cache:
                        "no-store"

                }

            );


        if (
            resposta.status === 401
        ) {

            window.location.href =
                "login.html";


            return;

        }


        const dados =
            await resposta
                .json()
                .catch(
                    () => ({})
                );


        if (
            !resposta.ok
        ) {

            throw new Error(
                dados.mensagem ||
                "Não foi possível verificar o companheiro."
            );

        }


        if (
            dados.criado === true
        ) {

            console.log(
                "Usuário já possui companheiro:",
                dados.companheiro
            );


            window.location.href =
                "index.html";


            return;

        }


        mostrarEtapaEspecie();


    } catch (erro) {

        console.error(
            "Erro ao iniciar criação:",
            erro
        );


        alert(
            "Não foi possível carregar a criação do companheiro."
        );

    }

}


// ========================================
// INICIAR
// ========================================

iniciarCriacaoCompanheiro();