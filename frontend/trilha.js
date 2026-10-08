"use strict";

(() => {
    const API = "/api";

    const nivel =
        new URLSearchParams(window.location.search).get("nivel") || "facil";

    const listaModulos = document.getElementById("modulos");
    const resumo = document.getElementById("resumo");
    const estado = document.getElementById("estado");
    const tentar = document.getElementById("tentar");
    const dificuldade = document.getElementById("dificuldade");

    let carregando = false;

    function criarElemento(tag, classe, texto) {
        const elemento = document.createElement(tag);
        elemento.className = classe;

        if (texto !== undefined) {
            elemento.textContent = texto;
        }

        return elemento;
    }

    function mostrarTrilha(dados, progresso) {
        dificuldade.textContent = dados.emoji + " " + dados.nome;

        document.title = "Trilha " + dados.nome + " | EcoEnergia";

        resumo.replaceChildren(
            criarElemento("li", "", dados.totalModulos + " módulos"),
            criarElemento("li", "", dados.totalBlocos + " blocos")
        );

        if (progresso) {
            resumo.append(
                criarElemento(
                    "li",
                    "",
                    progresso.blocosConcluidos +
                    " concluídos · " +
                    progresso.porcentagem +
                    "%"
                )
            );
        }

        const porId = new Map(
            (progresso?.blocos || []).map(bloco => [
                bloco.atividadeId,
                bloco
            ])
        );

        const fragmento = document.createDocumentFragment();

        const moduloAtual = dados.modulos.find(modulo =>
            modulo.blocos.some(
                bloco =>
                    bloco.atividadeId === progresso?.proximaAtividadeId
            )
        );

        dados.modulos.forEach((modulo, indice) => {
            const cartao = criarElemento("details", "modulo");

            cartao.open = moduloAtual
                ? modulo.id === moduloAtual.id
                : indice === 0;

            cartao.dataset.moduloId = modulo.id;

            const cabecalho = criarElemento("summary", "");

            const selo = criarElemento(
                "span",
                "selo",
                modulo.ordem
            );

            selo.setAttribute("aria-hidden", "true");

            const titulo = criarElemento("span", "titulo-modulo");

            titulo.append(
                criarElemento(
                    "small",
                    "",
                    "Módulo " +
                    modulo.ordem +
                    " · " +
                    modulo.blocos.length +
                    " blocos"
                ),
                criarElemento("strong", "", modulo.nome)
            );

            const seta = criarElemento("span", "seta", "⌄");
            seta.setAttribute("aria-hidden", "true");

            cabecalho.append(selo, titulo, seta);

            const lista = criarElemento("ol", "blocos");

            modulo.blocos.forEach(bloco => {
                const status = porId.get(bloco.atividadeId);

                const liberado = status?.liberado === true;
                const concluido = status?.concluido === true;

                const item = criarElemento("li", "bloco");

                item.dataset.atividadeId = bloco.atividadeId;

                const bolha = criarElemento(
                    liberado || !progresso ? "a" : "button",
                    "bolha",
                    concluido
                        ? "✓"
                        : liberado || !progresso
                            ? bloco.ordem
                            : "🔒"
                );

                bolha.style.color = "inherit";
                bolha.style.textDecoration = "none";
                bolha.style.fontFamily = "inherit";

                if (!progresso) {
                    bolha.href = "login.html";

                    bolha.setAttribute(
                        "aria-label",
                        "Faça login para acessar esta atividade"
                    );
            } else if (liberado) {
                bolha.href =
                    "quiz.html?" +
                    new URLSearchParams({
                        nivel,
                        atividadeId: bloco.atividadeId
                    });

                bolha.setAttribute(
                    "aria-label",
                    (concluido ? "Revisar: " : "Abrir: ") + bloco.nome
                );
            } else {
                bolha.type = "button";
                bolha.disabled = true;
                bolha.style.opacity = "0.5";

                bolha.setAttribute(
                    "aria-label",
                    bloco.nome + ": bloqueado"
                );
            }

            bolha.style.cursor = bolha.disabled
                ? "not-allowed"
                : "pointer";

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
                    "Bloco " +
                    bloco.ordem +
                    " · " +
                    bloco.totalPerguntas +
                    " perguntas"
                ),
                criarElemento(
                    "span",
                    "quantidade",
                    !progresso
                        ? "Entre para jogar"
                        : concluido
                            ? "Concluído · Revisar"
                            : liberado
                                ? "Começar →"
                                : "Conclua os anteriores"
                )
            );

            item.append(bolha, textos);
            lista.append(item);
        });

        cartao.append(
            cabecalho,
            criarElemento(
                "p",
                "descricao-modulo",
                modulo.introducao
            ),
            lista
        );

        fragmento.append(cartao);
    });

    listaModulos.replaceChildren(fragmento);
    resumo.hidden = false;
}

    async function carregarTrilha() {
    if (carregando) return;

    carregando = true;

    estado.textContent = "Carregando os módulos e seu progresso...";

    tentar.hidden = true;
    tentar.disabled = true;
    resumo.hidden = true;

    listaModulos.replaceChildren();
    listaModulos.setAttribute("aria-busy", "true");

    const controle = new AbortController();

    const limite = setTimeout(
        () => controle.abort(),
        15000
    );

    try {
        const base =
            API + "/trilhas/" + encodeURIComponent(nivel);

        const opcoes = {
            cache: "no-store",
            credentials: "include",
            signal: controle.signal
        };

        const resposta = await fetch(base, opcoes);

        if (!resposta.ok) {
            throw new Error(
                resposta.status === 404
                    ? "Esta trilha ainda não está disponível. Escolha outra dificuldade."
                    : "Não foi possível carregar a trilha."
            );
        }

        const dados = await resposta.json();

        if (
            !Array.isArray(dados.modulos) ||
            !dados.modulos.length
        ) {
            throw new Error("A trilha não possui módulos.");
        }

        const consulta = await fetch(
            base + "/progresso",
            opcoes
        );

        let progresso = null;

        if (consulta.ok) {
            progresso = await consulta.json();

            if (!Array.isArray(progresso.blocos)) {
                throw new Error("O progresso recebido é inválido.");
            }
        } else if (consulta.status !== 401) {
            throw new Error(
                "Não foi possível consultar seu progresso. Tente novamente."
            );
        }

        mostrarTrilha(dados, progresso);

        estado.textContent = progresso
            ? "Clique em um círculo liberado para abrir as perguntas."
            : "Faça login para responder aos blocos e salvar seu progresso. Os círculos levam ao login.";
    } catch (erro) {
        console.error("Erro ao carregar a trilha:", erro);

        estado.textContent =
            erro.name === "AbortError"
                ? "O servidor demorou para responder. Tente novamente."
                : erro.message;

        tentar.hidden = false;
    } finally {
        clearTimeout(limite);

        carregando = false;
        tentar.disabled = false;

        listaModulos.setAttribute("aria-busy", "false");
    }
}

tentar.addEventListener("click", carregarTrilha);

window.addEventListener("pageshow", evento => {
    if (evento.persisted) {
        carregarTrilha();
    }
});

carregarTrilha();
}) ();