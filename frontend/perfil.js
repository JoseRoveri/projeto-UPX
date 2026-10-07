"use strict";

const API = "/api";
const elemento = id => document.getElementById(id);
const modal = elemento("configuracoes");

let usuario;
let ocupado = false;


// =========================================================
// SESSÃO / USUÁRIO
// =========================================================

function guardarUsuario() {

    try {

        localStorage.setItem(
            "ecoUsuario",
            JSON.stringify(usuario)
        );

    } catch { }

}


function limparSessao() {

    try {

        localStorage.removeItem(
            "ecoUsuario"
        );

    } catch { }

}


// =========================================================
// API
// =========================================================

async function consultar(
    caminho,
    opcoes = {}
) {

    const controle =
        new AbortController();


    const limite =
        setTimeout(
            () => controle.abort(),
            12000
        );


    try {

        const resposta =
            await fetch(
                API + caminho,
                {
                    ...opcoes,

                    credentials:
                        "include",

                    cache:
                        "no-store",

                    signal:
                        controle.signal
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

            const erro =
                new Error(
                    dados.mensagem ||
                    "Não foi possível concluir. Tente novamente."
                );


            erro.status =
                resposta.status;


            throw erro;

        }


        return dados;


    } catch (erro) {


        if (
            erro.name ===
            "AbortError"
        ) {

            throw new Error(
                "O servidor demorou para responder. Tente novamente."
            );

        }


        if (
            erro instanceof TypeError
        ) {

            throw new Error(
                "Não foi possível conectar ao servidor."
            );

        }


        throw erro;


    } finally {

        clearTimeout(
            limite
        );

    }

}


// =========================================================
// COMPANHEIRO
// =========================================================

const COMPANHEIRO_SVGS = {

    brotim:
        "imagens/personagens/brotim/brotim.svg",

    gotim:
        "imagens/personagens/gotim/gotim.svg",

    faisquinha:
        "imagens/personagens/faisquinha/faisquinha.svg"

};


const COMPANHEIRO_CORES_PRINCIPAIS = {

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


const COMPANHEIRO_CORES_SECUNDARIAS = {

    claro:
        "#F8F8F2",

    turquesa:
        "#56D6D2",

    amarelo:
        "#FFE66D",

    creme:
        "#FFF0C9"

};


const NOMES_ESPECIES = {

    brotim:
        "Brotim",

    gotim:
        "Gotim",

    faisquinha:
        "Faisquinha"

};


const DETALHES_ESPECIES = {

    brotim:
        "🌱 Afinidade com a natureza",

    gotim:
        "💧 Afinidade com a água",

    faisquinha:
        "⚡ Afinidade com a energia"

};


// =========================================================
// NORMALIZAR COMPANHEIRO
// =========================================================

function normalizarCompanheiro(
    dados
) {

    return {

        nome:
            dados.nome || "",

        especie:
            dados.especie,

        corPrincipal:
            dados.corPrincipal ??
            dados.cor_principal,

        corSecundaria:
            dados.corSecundaria ??
            dados.cor_secundaria,

        olhos:
            dados.olhos,

        expressao:
            dados.expressao

    };

}


// =========================================================
// COR PRINCIPAL
// =========================================================

function aplicarCorPrincipalCompanheiro(
    svg,
    corId
) {

    const cor =
        COMPANHEIRO_CORES_PRINCIPAIS[
        corId
        ];


    if (
        !cor
    ) {

        return;

    }


    svg.style.setProperty(
        "--cor-principal",
        cor
    );


    svg.querySelectorAll(
        '[fill*="--cor-principal"]'
    ).forEach(

        parte => {

            parte.style.fill =
                cor;

        }

    );

}


// =========================================================
// COR SECUNDÁRIA
// =========================================================

function aplicarCorSecundariaCompanheiro(
    svg,
    corId
) {

    const cor =
        COMPANHEIRO_CORES_SECUNDARIAS[
        corId
        ];


    if (
        !cor
    ) {

        return;

    }


    svg.style.setProperty(
        "--cor-secundaria",
        cor
    );


    svg.querySelectorAll(
        '[fill*="--cor-secundaria"]'
    ).forEach(

        parte => {

            parte.style.fill =
                cor;

        }

    );

}


// =========================================================
// OLHOS
// =========================================================

function aplicarOlhosCompanheiro(
    svg,
    tipo
) {

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

            if (
                !grupo
            ) {

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


    if (
        !escolhido
    ) {

        return;

    }


    escolhido.removeAttribute(
        "display"
    );


    escolhido.style.removeProperty(
        "display"
    );

}


// =========================================================
// EXPRESSÃO
// =========================================================

function aplicarExpressaoCompanheiro(
    svg,
    tipo
) {

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

            if (
                !grupo
            ) {

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


    if (
        escolhida
    ) {

        escolhida.removeAttribute(
            "display"
        );


        escolhida.style.removeProperty(
            "display"
        );

    }


    const sobrancelhasBase =
        svg.querySelector(
            "#sobrancelhas-base"
        );


    if (
        sobrancelhasBase
    ) {

        if (
            tipo ===
            "sorriso"
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

}


// =========================================================
// INICIAIS DO USUÁRIO
// =========================================================

function obterIniciaisUsuario() {

    const nome =
        String(
            usuario?.nome ||
            "EcoEnergia"
        ).trim();


    const partes =
        nome

            ? nome.split(
                /\s+/
            )

            : [
                "E"
            ];


    const primeira =
        partes[0]?.[0] ||
        "E";


    const ultima =

        partes.length > 1

            ? partes.at(-1)?.[0] ||
            ""

            : "";


    return (
        primeira +
        ultima
    ).toLocaleUpperCase(
        "pt-BR"
    );

}


// =========================================================
// FALLBACK DO AVATAR
// =========================================================

function mostrarAvatarIniciais() {

    const avatar =
        elemento(
            "avatar"
        );


    if (
        !avatar
    ) {

        return;

    }


    avatar.replaceChildren();


    avatar.textContent =
        obterIniciaisUsuario();


    avatar.setAttribute(
        "aria-hidden",
        "true"
    );


    avatar.removeAttribute(
        "aria-label"
    );


    avatar.removeAttribute(
        "title"
    );

}


// =========================================================
// TEXTO DO COMPANHEIRO
// =========================================================

function mostrarDadosCompanheiro(
    companheiro
) {

    const nome =
        elemento(
            "companheiro-nome"
        );


    const especie =
        elemento(
            "companheiro-especie"
        );


    const detalhe =
        elemento(
            "companheiro-detalhe"
        );


    if (
        nome
    ) {

        nome.textContent =

            companheiro.nome ||

            "Seu companheiro";

    }


    if (
        especie
    ) {

        especie.textContent =

            NOMES_ESPECIES[
            companheiro.especie
            ] ||

            companheiro.especie ||

            "—";

    }


    if (
        detalhe
    ) {

        detalhe.textContent =

            DETALHES_ESPECIES[
            companheiro.especie
            ] ||

            "✨ Companheiro EcoEnergia";

    }

}


function mostrarDadosCompanheiroVazio() {

    const nome =
        elemento(
            "companheiro-nome"
        );


    const especie =
        elemento(
            "companheiro-especie"
        );


    const detalhe =
        elemento(
            "companheiro-detalhe"
        );


    if (
        nome
    ) {

        nome.textContent =
            "Companheiro";

    }


    if (
        especie
    ) {

        especie.textContent =
            "—";

    }


    if (
        detalhe
    ) {

        detalhe.textContent =
            "🌱 Parceiro da sua jornada";

    }

}


// =========================================================
// CARREGAR COMPANHEIRO NO PERFIL
// =========================================================

async function carregarCompanheiroPerfil() {

    const avatar =
        elemento(
            "avatar"
        );


    if (
        !avatar
    ) {

        return false;

    }


    try {

        // ========================================
        // BUSCA COMPANHEIRO NO BACKEND
        // ========================================

        const dados =
            await consultar(
                "/companheiro"
            );


        if (

            dados.criado !==
            true ||

            !dados.companheiro

        ) {

            mostrarAvatarIniciais();

            mostrarDadosCompanheiroVazio();

            return false;

        }


        const companheiro =
            normalizarCompanheiro(
                dados.companheiro
            );


        // ========================================
        // NOME / ESPÉCIE / DETALHE
        // ========================================

        mostrarDadosCompanheiro(
            companheiro
        );


        // ========================================
        // CAMINHO SVG
        // ========================================

        const caminhoSvg =
            COMPANHEIRO_SVGS[
            companheiro.especie
            ];


        if (
            !caminhoSvg
        ) {

            throw new Error(
                "Espécie de companheiro inválida."
            );

        }


        // ========================================
        // CARREGA O SVG
        // ========================================

        const respostaSvg =
            await fetch(

                caminhoSvg,

                {

                    cache:
                        "no-store"

                }

            );


        if (
            !respostaSvg.ok
        ) {

            throw new Error(

                `Não foi possível carregar ${caminhoSvg} (${respostaSvg.status}).`

            );

        }


        const codigoSvg =
            await respostaSvg.text();


        avatar.innerHTML =
            codigoSvg;


        const svg =
            avatar.querySelector(
                "svg"
            );


        if (
            !svg
        ) {

            throw new Error(
                "O arquivo carregado não contém um SVG válido."
            );

        }


        // ========================================
        // TAMANHO
        // ========================================

        svg.style.width =
            "100%";


        svg.style.height =
            "100%";


        svg.style.display =
            "block";


        // ========================================
        // PERSONALIZAÇÃO SALVA
        // ========================================

        aplicarCorPrincipalCompanheiro(

            svg,

            companheiro.corPrincipal

        );


        aplicarCorSecundariaCompanheiro(

            svg,

            companheiro.corSecundaria

        );


        aplicarOlhosCompanheiro(

            svg,

            companheiro.olhos

        );


        aplicarExpressaoCompanheiro(

            svg,

            companheiro.expressao

        );


        // ========================================
        // ACESSIBILIDADE
        // ========================================

        avatar.removeAttribute(
            "aria-hidden"
        );


        avatar.setAttribute(

            "aria-label",

            companheiro.nome

                ? `Seu companheiro ${companheiro.nome}`

                : "Seu companheiro EcoEnergia"

        );


        avatar.title =

            companheiro.nome

                ? `Companheiro: ${companheiro.nome}`

                : "Seu companheiro EcoEnergia";


        console.log(
            "Companheiro carregado no perfil ✅",
            companheiro
        );


        return true;


    } catch (
    erro
    ) {

        console.error(

            "Erro ao carregar companheiro no perfil:",

            erro

        );


        mostrarAvatarIniciais();


        return false;

    }

}


// =========================================================
// IDENTIDADE
// =========================================================

function mostrarIdentidade() {

    elemento(
        "nome-perfil"
    ).textContent =
        usuario.nome;


    const avatar =
        elemento(
            "avatar"
        );


    if (

        avatar &&

        !avatar.querySelector(
            "svg"
        )

    ) {

        avatar.textContent =
            obterIniciaisUsuario();

    }


    elemento(
        "tipo-perfil"
    ).textContent = ({

        aluno:
            "Conta de estudante",

        professor:
            "Conta de professor",

        responsavel:
            "Conta de responsável"

    })[
    usuario.tipo
    ] ||

        "Conta EcoEnergia";


    guardarUsuario();


    carregarPreferenciaVisual();

}


// =========================================================
// PERFIL
// =========================================================

function mostrarPerfil(
    dados
) {

    usuario =
        dados.usuario;


    const trilha =
        dados.trilha;


    const feitos =
        trilha.blocosConcluidos;


    const total =
        trilha.totalBlocos;


    const completo =

        total > 0 &&

        feitos === total;


    mostrarIdentidade();


    elemento(
        "xp"
    ).textContent =

        Number(
            usuario.xp ||
            0
        ).toLocaleString(
            "pt-BR"
        );


    elemento(
        "ofensiva"
    ).textContent =
        usuario.sequencia;


    elemento(
        "liga"
    ).textContent =

        usuario.liga ||

        "Bronze";


    elemento(
        "blocos"
    ).textContent =

        `${feitos} / ${total}`;


    elemento(
        "progresso"
    ).value =

        total

            ? Math.round(
                (
                    feitos /
                    total
                ) *
                100
            )

            : 0;


    elemento(
        "progresso-texto"
    ).textContent =

        `Trilha ${trilha.nome} · ${feitos} de ${total} blocos concluídos`;


    elemento(
        "continuar"
    ).href =

        "trilha.html?" +

        new URLSearchParams({

            nivel:
                trilha.nivel

        });


    elemento(
        "continuar"
    ).textContent =

        completo

            ? "Revisar trilha →"

            : feitos

                ? "Continuar trilha →"

                : "Começar trilha →";


    const conquistas = [


        [

            "🌱",

            "Primeiros passos",

            "Conclua seu primeiro bloco.",

            feitos >= 1

        ],


        [

            "☀️",

            "Módulo completo",

            "Conclua todos os blocos de um módulo.",

            trilha.modulosConcluidos >=
            1

        ],


        [

            "🌿",

            "Meia trilha",

            `Conclua ${Math.ceil(
                total /
                2
            )} blocos da trilha.`,

            total > 0 &&

            feitos >=

            Math.ceil(
                total /
                2
            )

        ],


        [

            "🌎",

            "Trilha completa",

            `Conclua todos os ${total} blocos.`,

            completo

        ]


    ];


    const lista =
        elemento(
            "conquistas"
        );


    lista.replaceChildren();


    for (

        const [

            icone,

            titulo,

            descricao,

            liberada

        ] of conquistas

    ) {


        const item =
            document.createElement(
                "li"
            );


        item.className =

            "cartao conquista" +

            (
                liberada
                    ? " desbloqueada"
                    : ""
            );


        const medalha =
            document.createElement(
                "span"
            );


        medalha.className =
            "medalha";


        medalha.textContent =

            liberada

                ? icone

                : "🔒";


        medalha.setAttribute(
            "aria-hidden",
            "true"
        );


        const tituloEl =
            document.createElement(
                "strong"
            );


        tituloEl.textContent =
            titulo;


        const descricaoEl =
            document.createElement(
                "p"
            );


        descricaoEl.textContent =
            descricao;


        const statusEl =
            document.createElement(
                "small"
            );


        statusEl.textContent =

            liberada

                ? "Conquistada ✓"

                : "Bloqueada";


        item.append(

            medalha,

            tituloEl,

            descricaoEl,

            statusEl

        );


        lista.append(
            item
        );

    }

}


// =========================================================
// PERSONALIZAÇÃO VISUAL
// =========================================================

function aplicarPersonalizacaoVisual(
    itens
) {

    const avatar =
        elemento(
            "avatar"
        );


    const capa =
        document.querySelector(
            ".capa"
        );


    if (

        !avatar ||

        !capa

    ) {

        return;

    }


    avatar.classList.remove(

        "moldura-verde",

        "moldura-energia"

    );


    capa.classList.remove(

        "fundo-solar",

        "fundo-agua"

    );


    const equipados =

        (
            itens ||
            []
        ).filter(

            item =>
                item.equipado

        );


    for (
        const item of
        equipados
    ) {


        if (

            item.nome ===
            "Moldura Verde"

        ) {

            avatar.classList.add(
                "moldura-verde"
            );

        }


        if (

            item.nome ===
            "Moldura Energia"

        ) {

            avatar.classList.add(
                "moldura-energia"
            );

        }


        if (

            item.nome ===
            "Fundo Solar"

        ) {

            capa.classList.add(
                "fundo-solar"
            );

        }


        if (

            item.nome ===
            "Fundo Água"

        ) {

            capa.classList.add(
                "fundo-agua"
            );

        }

    }

}


// =========================================================
// CARREGAR VISUAL DA PERSONALIZAÇÃO
// =========================================================

async function carregarVisualPersonalizacao() {

    try {

        const dados =
            await consultar(
                "/loja"
            );


        aplicarPersonalizacaoVisual(
            dados.itens
        );


    } catch (
    erro
    ) {

        console.error(

            "Erro ao carregar personalização:",

            erro.message

        );

    }

}


// =========================================================
// CARREGAR PERFIL
// =========================================================

async function carregarPerfil() {

    elemento(
        "perfil"
    ).hidden =
        true;


    elemento(
        "estado"
    ).hidden =
        false;


    elemento(
        "tentar"
    ).hidden =
        true;


    elemento(
        "entrar"
    ).hidden =
        true;


    elemento(
        "mensagem"
    ).textContent =
        "Carregando seu perfil...";


    try {

        const dadosPerfil =
            await consultar(
                "/perfil"
            );


        mostrarPerfil(
            dadosPerfil
        );


        await carregarCompanheiroPerfil();


        await carregarVisualPersonalizacao();


        elemento(
            "estado"
        ).hidden =
            true;


        elemento(
            "perfil"
        ).hidden =
            false;


    } catch (
    erro
    ) {


        if (

            erro.status ===
            401

        ) {

            limparSessao();

        }


        elemento(
            "mensagem"
        ).textContent =

            erro.status ===
                401

                ? "Entre na sua conta para ver seu perfil."

                : erro.message;


        elemento(
            "entrar"
        ).hidden =

            erro.status !==
            401;


        elemento(
            "tentar"
        ).hidden =

            erro.status ===
            401;

    }

}


// =========================================================
// ESTADO
// =========================================================

function travarFormulario(
    valor
) {

    ocupado =
        valor;


    for (

        const id of [

            "nome",

            "salvar",

            "sair",

            "cancelar",

            "fechar"

        ]

    ) {


        const campo =
            elemento(
                id
            );


        if (
            campo
        ) {

            campo.disabled =
                valor;

        }

    }

}


// =========================================================
// RETORNO
// =========================================================

function mostrarRetorno(
    texto,
    erro = false
) {

    const retorno =
        elemento(
            "retorno"
        );


    retorno.textContent =
        texto;


    retorno.classList.toggle(

        "erro",

        erro

    );

}


// =========================================================
// ITEM DE PERSONALIZAÇÃO
// =========================================================

function criarItemPersonalizacao(
    item
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "cfg-item-cosmetico";


    const preview =
        document.createElement(
            "div"
        );


    preview.className =
        "cfg-item-preview";


    preview.textContent =

        item.categoria ===
            "moldura"

            ? "🖼️"

            : "🌄";


    if (
        item.imagem
    ) {

        preview.style.backgroundImage =

            `url("${item.imagem}")`;

    }


    const informacoes =
        document.createElement(
            "div"
        );


    informacoes.className =
        "cfg-item-cosmetico-info";


    const nome =
        document.createElement(
            "strong"
        );


    nome.textContent =
        item.nome;


    const status =
        document.createElement(
            "small"
        );


    status.textContent =

        item.equipado

            ? "Equipado no perfil ⭐"

            : "Disponível para equipar";


    informacoes.append(

        nome,

        status

    );


    const botao =
        document.createElement(
            "button"
        );


    botao.type =
        "button";


    botao.dataset.itemId =
        item.id;


    if (
        item.equipado
    ) {


        botao.className =
            "btn-item-equipado";


        botao.textContent =
            "Desequipar";


        botao.addEventListener(

            "click",

            () => {

                desequiparItem(

                    Number(
                        item.id
                    ),

                    botao

                );

            }

        );


    } else {


        botao.className =
            "btn-equipar-item";


        botao.textContent =
            "Equipar";


        botao.addEventListener(

            "click",

            () => {

                equiparItem(

                    Number(
                        item.id
                    ),

                    botao

                );

            }

        );

    }


    card.append(

        preview,

        informacoes,

        botao

    );


    return card;

}


// =========================================================
// LISTA DE PERSONALIZAÇÃO
// =========================================================

function mostrarGrupoPersonalizacao(
    elementoId,
    itens
) {

    const lista =
        elemento(
            elementoId
        );


    lista.replaceChildren();


    if (
        !itens.length
    ) {

        const vazio =
            document.createElement(
                "p"
            );


        vazio.className =
            "suave";


        vazio.textContent =
            "Você ainda não possui itens desta categoria.";


        lista.append(
            vazio
        );


        return;

    }


    for (
        const item of
        itens
    ) {

        lista.append(

            criarItemPersonalizacao(
                item
            )

        );

    }

}


// =========================================================
// CARREGAR PERSONALIZAÇÃO
// =========================================================

async function carregarPersonalizacao() {

    const molduras =
        elemento(
            "personalizacao-molduras"
        );


    const fundos =
        elemento(
            "personalizacao-fundos"
        );


    molduras.innerHTML =
        '<p class="suave">Carregando suas molduras...</p>';


    fundos.innerHTML =
        '<p class="suave">Carregando seus fundos...</p>';


    try {

        const dados =
            await consultar(
                "/loja"
            );


        aplicarPersonalizacaoVisual(
            dados.itens
        );


        const comprados =

            (
                dados.itens ||
                []
            ).filter(

                item =>
                    item.comprado

            );


        const itensMoldura =
            comprados.filter(

                item =>

                    item.categoria ===
                    "moldura"

            );


        const itensFundo =
            comprados.filter(

                item =>

                    item.categoria ===
                    "fundo"

            );


        mostrarGrupoPersonalizacao(

            "personalizacao-molduras",

            itensMoldura

        );


        mostrarGrupoPersonalizacao(

            "personalizacao-fundos",

            itensFundo

        );


    } catch (
    erro
    ) {

        molduras.replaceChildren();


        fundos.replaceChildren();


        const mensagem =
            document.createElement(
                "p"
            );


        mensagem.className =
            "retorno erro";


        mensagem.textContent =
            erro.message;


        molduras.append(
            mensagem
        );

    }

}


// =========================================================
// EQUIPAR
// =========================================================

async function equiparItem(
    itemId,
    botao
) {

    if (
        ocupado
    ) {

        return;

    }


    ocupado =
        true;


    const textoOriginal =
        botao.textContent;


    botao.disabled =
        true;


    botao.textContent =
        "Equipando...";


    try {

        const dados =
            await consultar(

                `/loja/${itemId}/equipar`,

                {

                    method:
                        "POST"

                }

            );


        mostrarRetorno(

            `${dados.item.nome} equipado com sucesso! ⭐`

        );


        await carregarPersonalizacao();


    } catch (
    erro
    ) {

        mostrarRetorno(

            erro.message,

            true

        );


        botao.disabled =
            false;


        botao.textContent =
            textoOriginal;


    } finally {

        ocupado =
            false;

    }

}


// =========================================================
// DESEQUIPAR
// =========================================================

async function desequiparItem(
    itemId,
    botao
) {

    if (
        ocupado
    ) {

        return;

    }


    ocupado =
        true;


    const textoOriginal =
        botao.textContent;


    botao.disabled =
        true;


    botao.textContent =
        "Desequipando...";


    try {

        await consultar(

            `/loja/${itemId}/desequipar`,

            {

                method:
                    "POST"

            }

        );


        mostrarRetorno(
            "Item desequipado com sucesso!"
        );


        await carregarPersonalizacao();


    } catch (
    erro
    ) {

        mostrarRetorno(

            erro.message,

            true

        );


        botao.disabled =
            false;


        botao.textContent =
            textoOriginal;


    } finally {

        ocupado =
            false;

    }

}


// =========================================================
// CONFIGURAÇÕES
// =========================================================

function abrirTelaConfiguracoes(
    tela,
    focar = true
) {

    if (
        ocupado
    ) {

        return;

    }


    const titulos = {

        inicio:
            "Configurações",

        preferencias:
            "Preferências",

        personalizacao:
            "Personalização",

        perfil:
            "Perfil",

        dados:
            "Dados da conta",

        ajuda:
            "Central de ajuda"

    };


    if (
        !titulos[
        tela
        ]
    ) {

        return;

    }


    modal

        .querySelectorAll(
            "[data-cfg-tela]"
        )

        .forEach(

            secao => {

                secao.hidden =

                    secao.dataset.cfgTela !==
                    tela;

            }

        );


    elemento(
        "configuracoes-titulo"
    ).textContent =

        titulos[
        tela
        ];


    elemento(
        "cfg-voltar"
    ).hidden =

        tela ===
        "inicio";


    modal

        .querySelector(
            ".cfg-conteudo"
        )

        .scrollTop =
        0;


    mostrarRetorno(
        ""
    );


    if (
        tela ===
        "perfil"
    ) {

        elemento(
            "nome"
        ).value =
            usuario.nome;


        elemento(
            "email"
        ).value =
            usuario.email;

    }


    if (
        tela ===
        "personalizacao"
    ) {

        carregarPersonalizacao();

    }


    if (
        focar
    ) {

        const destino =

            tela ===
                "perfil"

                ? "nome"

                : "configuracoes-titulo";


        elemento(
            destino
        ).focus();

    }

}


// =========================================================
// TEMA
// =========================================================

function aplicarTemaPerfil(
    escuro
) {

    document

        .documentElement

        .classList

        .toggle(

            "perfil-escuro",

            escuro

        );


    elemento(
        "cfg-escuro"
    ).checked =
        escuro;

}


function carregarPreferenciaVisual() {

    let escuro =
        false;


    try {

        escuro =

            localStorage.getItem(

                "ecoTemaPerfil:" +
                usuario.id

            ) ===
            "escuro";


    } catch { }


    aplicarTemaPerfil(
        escuro
    );

}


// =========================================================
// ABRIR CONFIGURAÇÕES
// =========================================================

elemento(
    "configurar"
).addEventListener(

    "click",

    () => {

        elemento(
            "nome"
        ).value =
            usuario.nome;


        elemento(
            "email"
        ).value =
            usuario.email;


        mostrarRetorno(
            ""
        );


        abrirTelaConfiguracoes(

            "inicio",

            false

        );


        modal.showModal();


        document

            .body

            .classList

            .add(
                "cfg-aberta"
            );

    }

);


// =========================================================
// FECHAR CONFIGURAÇÕES
// =========================================================

for (

    const id of [

        "fechar",

        "cancelar"

    ]

) {

    elemento(
        id
    ).addEventListener(

        "click",

        () => {

            modal.close();

        }

    );

}


// =========================================================
// CANCELAR MODAL
// =========================================================

modal.addEventListener(

    "cancel",

    evento => {

        if (
            ocupado
        ) {

            evento.preventDefault();

        }

    }

);


// =========================================================
// FECHOU MODAL
// =========================================================

modal.addEventListener(

    "close",

    () => {

        abrirTelaConfiguracoes(

            "inicio",

            false

        );


        document

            .body

            .classList

            .remove(
                "cfg-aberta"
            );

    }

);


// =========================================================
// NAVEGAÇÃO CONFIGURAÇÕES
// =========================================================

modal

    .querySelectorAll(
        "[data-cfg-abrir]"
    )

    .forEach(

        botao => {

            botao.addEventListener(

                "click",

                () => {

                    abrirTelaConfiguracoes(

                        botao.dataset.cfgAbrir

                    );

                }

            );

        }

    );


// =========================================================
// VOLTAR
// =========================================================

elemento(
    "cfg-voltar"
).addEventListener(

    "click",

    () => {

        abrirTelaConfiguracoes(
            "inicio"
        );

    }

);


// =========================================================
// BLOQUEAR NAVEGAÇÃO DURANTE AÇÃO
// =========================================================

modal.addEventListener(

    "click",

    evento => {

        const navegacao =
            evento.target.closest(

                "[data-cfg-abrir], #cfg-voltar, #cfg-escuro, a"

            );


        if (

            ocupado &&

            navegacao

        ) {

            evento.preventDefault();


            evento.stopImmediatePropagation();

        }

    },

    true

);


// =========================================================
// EDITAR PERFIL
// =========================================================

elemento(
    "formulario"
).addEventListener(

    "submit",

    async evento => {

        evento.preventDefault();


        if (
            ocupado
        ) {

            return;

        }


        travarFormulario(
            true
        );


        mostrarRetorno(
            "Salvando..."
        );


        try {

            const dados =
                await consultar(

                    "/perfil",

                    {

                        method:
                            "PATCH",


                        headers: {

                            "Content-Type":
                                "application/json"

                        },


                        body:
                            JSON.stringify({

                                nome:
                                    elemento(
                                        "nome"
                                    ).value

                            })

                    }

                );


            usuario.nome =
                dados.nome;


            mostrarIdentidade();


            elemento(
                "nome"
            ).value =
                dados.nome;


            mostrarRetorno(
                "Alterações salvas!"
            );


        } catch (
        erro
        ) {

            mostrarRetorno(

                erro.message,

                true

            );


            if (

                erro.status ===
                401

            ) {

                modal.close();


                await carregarPerfil();

            }


        } finally {

            travarFormulario(
                false
            );

        }

    }

);


// =========================================================
// LOGOUT
// =========================================================

elemento(
    "sair"
).addEventListener(

    "click",

    async () => {

        if (
            ocupado
        ) {

            return;

        }


        travarFormulario(
            true
        );


        mostrarRetorno(
            "Saindo..."
        );


        try {

            await consultar(

                "/logout",

                {

                    method:
                        "POST"

                }

            );


            limparSessao();


            window.location.replace(
                "login.html"
            );


        } catch (
        erro
        ) {

            if (

                erro.status ===
                401

            ) {

                limparSessao();


                window.location.replace(
                    "login.html"
                );


            } else {

                mostrarRetorno(

                    erro.message,

                    true

                );

            }


        } finally {

            travarFormulario(
                false
            );

        }

    }

);


// =========================================================
// TEMA ESCURO
// =========================================================

elemento(
    "cfg-escuro"
).addEventListener(

    "change",

    evento => {

        const escuro =
            evento.target.checked;


        aplicarTemaPerfil(
            escuro
        );


        try {

            localStorage.setItem(

                "ecoTemaPerfil:" +
                usuario.id,


                escuro

                    ? "escuro"

                    : "claro"

            );


            mostrarRetorno(
                "Preferência salva neste navegador."
            );


        } catch {

            mostrarRetorno(

                "Tema aplicado. O navegador não permitiu salvar a preferência.",

                true

            );

        }

    }

);


// =========================================================
// RECARREGAR
// =========================================================

elemento(
    "tentar"
).addEventListener(

    "click",

    carregarPerfil

);


// =========================================================
// VOLTAR PELO CACHE
// =========================================================

window.addEventListener(

    "pageshow",

    evento => {

        if (
            evento.persisted
        ) {

            if (
                modal.open
            ) {

                modal.close();

            }


            carregarPerfil();

        }

    }

);


// =========================================================
// INICIAR
// =========================================================

carregarPerfil();