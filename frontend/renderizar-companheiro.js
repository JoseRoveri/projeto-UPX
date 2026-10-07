// ========================================
// CAMINHOS DOS SVGs
// ========================================

const COMPANHEIRO_SVGS = {

    brotim:
        "imagens/personagens/brotim/brotim.svg",

    gotim:
        "imagens/personagens/gotim/gotim.svg",

    faisquinha:
        "imagens/personagens/faisquinha/faisquinha.svg"

};


// ========================================
// CORES PRINCIPAIS
// ========================================

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


// ========================================
// CORES SECUNDÁRIAS
// ========================================

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


// ========================================
// COR PRINCIPAL
// ========================================

function aplicarCorPrincipalCompanheiro(
    svg,
    corId
) {

    const cor =
        COMPANHEIRO_CORES_PRINCIPAIS[
            corId
        ];


    if (!cor) {

        return;

    }


    svg.style.setProperty(
        "--cor-principal",
        cor
    );


    const partes =
        svg.querySelectorAll(
            '[fill*="--cor-principal"]'
        );


    partes.forEach(
        parte => {

            parte.style.fill =
                cor;

        }
    );

}


// ========================================
// COR SECUNDÁRIA
// ========================================

function aplicarCorSecundariaCompanheiro(
    svg,
    corId
) {

    const cor =
        COMPANHEIRO_CORES_SECUNDARIAS[
            corId
        ];


    if (!cor) {

        return;

    }


    svg.style.setProperty(
        "--cor-secundaria",
        cor
    );


    const partes =
        svg.querySelectorAll(
            '[fill*="--cor-secundaria"]'
        );


    partes.forEach(
        parte => {

            parte.style.fill =
                cor;

        }
    );

}


// ========================================
// OLHOS
// ========================================

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

        return;

    }


    escolhido.removeAttribute(
        "display"
    );


    escolhido.style.removeProperty(
        "display"
    );

}


// ========================================
// EXPRESSÃO
// ========================================

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


    if (
        sobrancelhasBase
    ) {

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

}


// ========================================
// RENDERIZAR COMPANHEIRO
// ========================================

async function renderizarCompanheiro(
    dados,
    elemento
) {

    if (
        !dados
    ) {

        console.warn(
            "Nenhum dado de companheiro recebido."
        );


        return false;

    }


    if (
        !elemento
    ) {

        console.warn(
            "Elemento de destino não encontrado."
        );


        return false;

    }


    const caminhoSvg =
        COMPANHEIRO_SVGS[
            dados.especie
        ];


    if (
        !caminhoSvg
    ) {

        console.error(
            "Espécie inválida:",
            dados.especie
        );


        return false;

    }


    try {


        const resposta =
            await fetch(

                caminhoSvg,

                {

                    cache:
                        "no-store"

                }

            );


        if (
            !resposta.ok
        ) {

            throw new Error(
                `Não foi possível carregar ${caminhoSvg}`
            );

        }


        const textoSvg =
            await resposta.text();


        elemento.innerHTML =
            textoSvg;


        const svg =
            elemento.querySelector(
                "svg"
            );


        if (
            !svg
        ) {

            throw new Error(
                "SVG não encontrado dentro do elemento."
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
        // PERSONALIZAÇÃO
        // ========================================

        aplicarCorPrincipalCompanheiro(
            svg,
            dados.corPrincipal
        );


        aplicarCorSecundariaCompanheiro(
            svg,
            dados.corSecundaria
        );


        aplicarOlhosCompanheiro(
            svg,
            dados.olhos
        );


        aplicarExpressaoCompanheiro(
            svg,
            dados.expressao
        );


        return true;


    } catch (erro) {


        console.error(
            "Erro ao renderizar companheiro:",
            erro
        );


        return false;

    }

}


// ========================================
// BUSCAR COMPANHEIRO
// ========================================

async function buscarCompanheiroAtual() {

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

            return {

                logado:
                    false,

                criado:
                    false,

                companheiro:
                    null

            };

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

                "Não foi possível carregar o companheiro."

            );

        }


        return {

            logado:
                true,

            criado:
                dados.criado === true,

            companheiro:
                dados.companheiro || null

        };


    } catch (erro) {


        console.error(
            "Erro ao buscar companheiro:",
            erro
        );


        return {

            logado:
                false,

            criado:
                false,

            companheiro:
                null

        };

    }

}


// ========================================
// DISPONIBILIZAR PARA OUTROS JS
// ========================================

window.renderizarCompanheiro =
    renderizarCompanheiro;


window.buscarCompanheiroAtual =
    buscarCompanheiroAtual;