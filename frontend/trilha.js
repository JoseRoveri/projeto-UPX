"use strict";

const parametros = new URLSearchParams(window.location.search);
const nivel = parametros.get("nivel") || "facil";

const listaModulos = document.getElementById("modulos");
const resumo = document.getElementById("resumo");
const estado = document.getElementById("estado");
const tentar = document.getElementById("tentar");
const dificuldade = document.getElementById("dificuldade");

// Cria um elemento e insere o texto recebido do backend.
function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);
    elemento.className = classe;

    if (texto !== undefined) {
        elemento.textContent = texto;
    }

    return elemento;
}

// Transforma os dados recebidos em módulos e blocos na tela.
function mostrarTrilha(dados) {
    dificuldade.textContent = dados.emoji + " " + dados.nome;

    document.title = "Trilha " + dados.nome + " | EcoEnergia";

    resumo.replaceChildren(
        criarElemento("li", "", dados.totalModulos + " módulos"),
        criarElemento("li", "", dados.totalBlocos + " blocos")
    );

    const fragmento = document.createDocumentFragment();

    dados.modulos.forEach((modulo, indice) => {
        const cartao = criarElemento("details", "modulo");

        cartao.open = indice === 0;
        cartao.dataset.moduloId = modulo.id;

        const cabecalho = criarElemento("summary", "");

        const selo = criarElemento(
            "span",
            "selo",
            modulo.ordem
        );

        selo.setAttribute("aria-hidden", "true");

        const tituloModulo = criarElemento(
            "span",
            "titulo-modulo"
        );

        tituloModulo.append(
            criarElemento(
                "small",
                "",
                "Módulo " + modulo.ordem +
                " · " + modulo.blocos.length + " blocos"
            ),
            criarElemento("strong", "", modulo.nome)
        );

        const seta = criarElemento("span", "seta", "⌄");
        seta.setAttribute("aria-hidden", "true");

        cabecalho.append(selo, tituloModulo, seta);

        const descricao = criarElemento(
            "p",
            "descricao-modulo",
            modulo.introducao
        );

        const listaBlocos = criarElemento("ol", "blocos");

        modulo.blocos.forEach(bloco => {
            const item = criarElemento("li", "bloco");

            item.dataset.atividadeId = bloco.atividadeId;

            const bolha = criarElemento(
                "span",
                "bolha",
                bloco.ordem
            );

            bolha.setAttribute("aria-hidden", "true");

            const textos = criarElemento("div", "");

            textos.append(
                criarElemento(
                    "strong",
                    "nome-bloco",
                    bloco.nome
                ),
                criarElemento(
                    "span",
                    "quantidade",
                    "Bloco " + bloco.ordem +
                    " · " + bloco.totalPerguntas + " perguntas"
                )
            );

            item.append(bolha, textos);
            listaBlocos.append(item);
        });

        cartao.append(cabecalho, descricao, listaBlocos);
        fragmento.append(cartao);
    });

    listaModulos.replaceChildren(fragmento);
    resumo.hidden = false;
}

// Consulta a estrutura da trilha no backend.
async function carregarTrilha() {
    estado.textContent = "Carregando os módulos...";

    tentar.hidden = true;
    tentar.disabled = true;
    resumo.hidden = true;

    listaModulos.replaceChildren();
    listaModulos.setAttribute("aria-busy", "true");

    const controle = new AbortController();

    const limite = setTimeout(
        () => controle.abort(),
        10000
    );

    let mensagemErro =
        "Não foi possível carregar a trilha. Tente novamente.";

    try {
        const resposta = await fetch(
            "http://127.0.0.1:3000/api/trilhas/" +
            encodeURIComponent(nivel),
            {
                cache: "no-store",
                signal: controle.signal
            }
        );

        if (!resposta.ok) {
            if (resposta.status === 404) {
                mensagemErro =
                    "Esta trilha ainda não está disponível. " +
                    "Escolha outra dificuldade.";
            }

            throw new Error(
                "Falha ao consultar a trilha: HTTP " +
                resposta.status
            );
        }

        const dados = await resposta.json();

        if (
            !Array.isArray(dados.modulos) ||
            dados.modulos.length === 0
        ) {
            throw new Error(
                "A trilha recebida não possui módulos."
            );
        }

        mostrarTrilha(dados);

        estado.textContent =
            "Abra um módulo para conhecer seus blocos.";
    } catch (erro) {
        console.error("Erro ao carregar a trilha:", erro);

        estado.textContent = mensagemErro;
        tentar.hidden = false;
    } finally {
        clearTimeout(limite);

        tentar.disabled = false;
        listaModulos.setAttribute("aria-busy", "false");
    }
}

tentar.addEventListener("click", carregarTrilha);

carregarTrilha();