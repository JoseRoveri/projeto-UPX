(() => {

    // =========================================================
    // API
    // =========================================================

    const API = "/api";


    // =========================================================
    // ELEMENTOS
    // =========================================================

    const saldoEcoMoedas =
        document.getElementById("saldo-ecomoedas");

    const listaLoja =
        document.getElementById("recompensas-loja-lista");

    const mensagemLoja =
        document.getElementById("mensagem-loja");


    // =========================================================
    // MODAL
    // =========================================================

    const modalCompra =
        document.getElementById("modal-compra");

    const modalCompraFundo =
        document.getElementById("modal-compra-fundo");

    const modalCompraIcone =
        document.getElementById("modal-compra-icone");

    const modalCompraTitulo =
        document.getElementById("modal-compra-titulo");

    const modalCompraMensagem =
        document.getElementById("modal-compra-mensagem");

    const modalCompraPreco =
        document.getElementById("modal-compra-preco");

    const modalCompraValor =
        document.getElementById("modal-compra-valor");

    const btnModalCompra =
        document.getElementById("btn-modal-compra");


    // =========================================================
    // CONTROLE
    // =========================================================

    let ocupado = false;


    // =========================================================
    // CONSULTAR API
    // =========================================================

    async function consultar(
        caminho,
        opcoes = {}
    ) {

        const resposta = await fetch(
            API + caminho,
            {
                credentials: "include",
                cache: "no-store",
                ...opcoes
            }
        );


        const dados =
            await resposta
                .json()
                .catch(() => ({}));


        if (resposta.status === 401) {

            window.location.href =
                "login.html";

            throw new Error(
                "Entre novamente na sua conta."
            );

        }


        if (!resposta.ok) {

            const erro =
                new Error(
                    dados.mensagem ||
                    "Não foi possível concluir a operação."
                );

            erro.status =
                resposta.status;

            erro.dados =
                dados;

            throw erro;

        }


        return dados;

    }


    // =========================================================
    // PERFIL
    // =========================================================

    async function consultarPerfil() {

        return consultar(
            "/perfil"
        );
    }

    async function consultarPerfilOpcional() {

        const resposta = await fetch(
            API + "/perfil",
            {
                credentials: "include",
                cache: "no-store"
            }
        );

        const dados =
            await resposta
                .json()
                .catch(() => ({}));

        if (resposta.status === 401) {
            return null;
        }

        if (!resposta.ok) {
            throw new Error(
                dados.mensagem ||
                "Não foi possível consultar o perfil."
            );
        }

        return dados;
    }


    // =========================================================
    // LOJA
    // =========================================================

    async function consultarLoja() {

        return consultar(
            "/loja"
        );
    }

    async function consultarLojaPublica() {
        return consultar(
            "/loja-publica"
        );
    }


    // =========================================================
    // MENSAGEM
    // =========================================================

    function mostrarMensagem(
        texto,
        erro = false
    ) {

        if (!mensagemLoja) {
            return;
        }


        if (!texto) {

            mensagemLoja.hidden =
                true;

            mensagemLoja.textContent =
                "";

            mensagemLoja.className =
                "mensagem-loja";

            return;

        }


        mensagemLoja.hidden =
            false;

        mensagemLoja.textContent =
            texto;


        mensagemLoja.className =
            erro
                ? "mensagem-loja erro"
                : "mensagem-loja sucesso";

    }


    // =========================================================
    // SALDO
    // =========================================================

    function mostrarSaldo(usuario) {

        const moedas =
            Number(
                usuario?.moedas
            ) || 0;


        if (!saldoEcoMoedas) {
            return;
        }


        saldoEcoMoedas.textContent =
            moedas.toLocaleString(
                "pt-BR"
            );

    }


    // =========================================================
    // PREÇO
    // =========================================================

    function criarPreco(item) {

        const preco =
            document.createElement(
                "div"
            );

        preco.className =
            "recompensa-item-preco";


        // =====================================================
        // ITEM DE CONQUISTA
        // =====================================================

        if (
            item.tipoAquisicao ===
            "conquista"
        ) {

            const texto =
                document.createElement(
                    "strong"
                );

            texto.textContent =
                item.comprado
                    ? "Conquistado ⭐"
                    : "Recompensa";

            preco.append(
                texto
            );

            return preco;
        }


        // =====================================================
        // ITEM NORMAL DA LOJA
        // =====================================================

        const moeda =
            document.createElement(
                "img"
            );

        moeda.src =
            "imagens/moeda.png";

        moeda.alt =
            "EcoMoeda";


        const valor =
            document.createElement(
                "strong"
            );

        valor.textContent =
            Number(
                item.preco
            ).toLocaleString(
                "pt-BR"
            );


        preco.append(
            moeda,
            valor
        );


        return preco;
    }


    // =========================================================
    // BOTÃO DO ITEM
    // =========================================================

    function criarBotaoItem(item) {

        const botao =
            document.createElement(
                "button"
            );


        botao.type =
            "button";


        botao.dataset.itemId =
            String(item.id);


        // =====================================================
        // CONQUISTA AINDA BLOQUEADA
        // =====================================================

        if (
            item.tipoAquisicao ===
            "conquista" &&

            !item.liberado &&

            !item.comprado
        ) {

            botao.className =
                "btn-item-bloqueado";

            botao.textContent =
                "🔒 Bloqueado";

            botao.disabled =
                true;

            botao.title =
                "Complete o requisito para desbloquear esta recompensa.";

            return botao;
        }


        // =====================================================
        // ITEM NORMAL AINDA NÃO COMPRADO
        // =====================================================

        if (!item.comprado) {

            botao.className =
                "btn-comprar-item";

            botao.textContent =
                "Comprar";

            return botao;
        }


        // =====================================================
        // ITEM EQUIPADO
        // =====================================================

        if (item.equipado) {

            botao.className =
                "btn-desequipar-item";

            botao.textContent =
                "Equipado ✓";

            botao.title =
                "Clique para desequipar";

            return botao;
        }


        // =====================================================
        // POSSUI O ITEM, MAS NÃO ESTÁ EQUIPADO
        // =====================================================

        botao.className =
            "btn-equipar-item";

        botao.textContent =
            "Equipar";


        return botao;
    }


    // =========================================================
    // MOSTRAR ITENS
    // =========================================================

    function mostrarItens(itens) {

        if (!listaLoja) {
            return;
        }


        listaLoja.replaceChildren();


        if (
            !Array.isArray(itens) ||
            itens.length === 0
        ) {

            const vazio =
                document.createElement(
                    "p"
                );


            vazio.className =
                "loja-vazia";


            vazio.textContent =
                "Nenhum item disponível no momento.";


            listaLoja.append(
                vazio
            );


            return;

        }


        itens.forEach(item => {

            // =================================================
            // CARD
            // =================================================

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "recompensa-item";


            if (item.comprado) {

                card.classList.add(
                    "item-comprado"
                );

            }


            if (item.equipado) {

                card.classList.add(
                    "item-equipado"
                );

            }


            // =================================================
            // IMAGEM
            // =================================================

            const imagemContainer =
                document.createElement(
                    "div"
                );


            imagemContainer.className =
                "recompensa-item-imagem";


            if (item.imagem) {

                const imagem =
                    document.createElement(
                        "img"
                    );


                imagem.src =
                    item.imagem;

                imagem.alt =
                    item.nome || "Item";


                imagem.addEventListener(
                    "error",
                    () => {

                        imagem.remove();

                        imagemContainer.textContent =
                            "🎁";

                    },
                    {
                        once: true
                    }
                );


                imagemContainer.appendChild(
                    imagem
                );

            } else {

                imagemContainer.textContent =
                    "🎁";

            }


            // =================================================
            // CATEGORIA
            // =================================================

            const categoria =
                document.createElement(
                    "span"
                );


            categoria.className =
                "recompensa-item-categoria";


            categoria.textContent =
                formatarCategoria(
                    item.categoria
                );


            // =================================================
            // NOME
            // =================================================

            const nome =
                document.createElement(
                    "h3"
                );


            nome.textContent =
                item.nome || "Item";


            // =================================================
            // DESCRIÇÃO
            // =================================================

            const descricao =
                document.createElement(
                    "p"
                );


            descricao.textContent =
                item.descricao || "";


            // =================================================
            // RODAPÉ
            // =================================================

            const rodape =
                document.createElement(
                    "div"
                );


            rodape.className =
                "recompensa-item-rodape";


            const preco =
                criarPreco(item);


            const botao =
                criarBotaoItem(item);


            rodape.append(
                preco,
                botao
            );


            // =================================================
            // MONTA CARD
            // =================================================

            card.append(
                imagemContainer,
                categoria,
                nome,
                descricao,
                rodape
            );


            listaLoja.appendChild(
                card
            );

        });

    }


    // =========================================================
    // FORMATAR CATEGORIA
    // =========================================================

    function formatarCategoria(categoria) {

        const categorias = {

            moldura:
                "🖼️ Moldura",

            fundo:
                "🌄 Fundo",

            cabeca:
                "🎩 Cabeça",

            rosto:
                "👓 Rosto",

            corpo:
                "👕 Corpo",

            costas:
                "🎒 Costas",

            efeito:
                "✨ Efeito"

        };


        return (
            categorias[categoria] ||
            "🎁 Item"
        );

    }


    // =========================================================
    // ABRIR MODAL
    // =========================================================

    function abrirModalCompra({

        tipo = "sucesso",

        titulo,

        mensagem,

        valor = null,

        faltam = null

    }) {

        if (!modalCompra) {
            return;
        }


        modalCompra.className =
            tipo === "erro"
                ? "modal-compra sem-moedas"
                : "modal-compra sucesso";


        // =====================================================
        // ÍCONE
        // =====================================================

        if (modalCompraIcone) {

            modalCompraIcone
                .replaceChildren();


            if (tipo === "erro") {

                const imagem =
                    document.createElement(
                        "img"
                    );


                imagem.src =
                    "imagens/moeda.png";

                imagem.alt =
                    "EcoMoeda";

                imagem.className =
                    "modal-compra-moeda-grande";


                modalCompraIcone
                    .appendChild(
                        imagem
                    );

            } else {

                modalCompraIcone.textContent =
                    "🎉";

            }

        }


        // =====================================================
        // TÍTULO
        // =====================================================

        if (modalCompraTitulo) {

            modalCompraTitulo.textContent =
                titulo || "";

        }


        // =====================================================
        // TEXTO
        // =====================================================

        if (modalCompraMensagem) {

            modalCompraMensagem.textContent =
                mensagem || "";

        }


        // =====================================================
        // PREÇO
        // =====================================================

        if (modalCompraPreco) {

            if (
                tipo === "erro" &&
                faltam !== null
            ) {

                modalCompraPreco.hidden =
                    false;


                modalCompraPreco.className =
                    "modal-compra-preco moedas-faltando";


                if (modalCompraValor) {

                    modalCompraValor.textContent =
                        `Faltam ${Number(faltam).toLocaleString("pt-BR")} EcoMoedas`;

                }

            } else if (
                valor !== null
            ) {

                modalCompraPreco.hidden =
                    false;


                modalCompraPreco.className =
                    "modal-compra-preco";


                if (modalCompraValor) {

                    modalCompraValor.textContent =
                        `-${Number(valor).toLocaleString("pt-BR")} EcoMoedas`;

                }

            } else {

                modalCompraPreco.hidden =
                    true;

            }

        }


        if (btnModalCompra) {

            btnModalCompra.textContent =
                "Continuar";

        }


        modalCompra.hidden =
            false;

    }


    // =========================================================
    // FECHAR MODAL
    // =========================================================

    function fecharModalCompra() {

        if (!modalCompra) {
            return;
        }


        modalCompra.hidden =
            true;

    }


    // =========================================================
    // COMPRAR ITEM
    // =========================================================

    async function comprarItem(
        itemId,
        botao
    ) {

        if (ocupado) {
            return;
        }


        ocupado = true;


        const textoOriginal =
            botao.textContent;


        botao.disabled =
            true;

        botao.textContent =
            "Comprando...";


        mostrarMensagem("");


        try {

            const dados =
                await consultar(
                    `/loja/${itemId}/comprar`,
                    {
                        method: "POST"
                    }
                );


            abrirModalCompra({

                tipo:
                    "sucesso",

                titulo:
                    "Compra realizada! 🎉",

                mensagem:
                    `${dados.item.nome} foi adicionado à sua coleção.`,

                valor:
                    Number(
                        dados.item.preco
                    )

            });


            await carregarLoja();


        } catch (erro) {

            const faltam =
                erro.dados?.faltam;


            if (
                faltam !== undefined
            ) {

                abrirModalCompra({

                    tipo:
                        "erro",

                    titulo:
                        "Faltam EcoMoedas!",

                    mensagem:
                        "Continue aprendendo e complete atividades para conseguir mais EcoMoedas.",

                    faltam:
                        Number(faltam)

                });

            } else {

                abrirModalCompra({

                    tipo:
                        "erro",

                    titulo:
                        "Ops!",

                    mensagem:
                        erro.message ||
                        "Não foi possível comprar este item."

                });

            }


            botao.disabled =
                false;

            botao.textContent =
                textoOriginal;


            console.error(
                "Erro ao comprar item:",
                erro
            );

        } finally {

            ocupado =
                false;

        }

    }


    // =========================================================
    // EQUIPAR ITEM
    // =========================================================

    async function equiparItem(
        itemId,
        botao
    ) {

        if (ocupado) {
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


        mostrarMensagem("");


        try {

            const dados =
                await consultar(
                    `/loja/${itemId}/equipar`,
                    {
                        method: "POST"
                    }
                );


            mostrarMensagem(
                `${dados.item.nome} equipado com sucesso! ⭐`
            );


            await carregarLoja();


        } catch (erro) {

            console.error(
                "Erro ao equipar item:",
                erro
            );


            mostrarMensagem(
                erro.message ||
                "Não foi possível equipar o item.",
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
    // DESEQUIPAR ITEM
    // =========================================================

    async function desequiparItem(
        itemId,
        botao
    ) {

        if (ocupado) {
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


        mostrarMensagem("");


        try {

            await consultar(
                `/loja/${itemId}/desequipar`,
                {
                    method: "POST"
                }
            );


            mostrarMensagem(
                "Item desequipado com sucesso!"
            );


            await carregarLoja();


        } catch (erro) {

            console.error(
                "Erro ao desequipar item:",
                erro
            );


            mostrarMensagem(
                erro.message ||
                "Não foi possível desequipar o item.",
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
    // CARREGAR LOJA
    // =========================================================

    async function carregarLoja() {

        try {

            const perfil =
                await consultarPerfilOpcional();

            const loja =
                perfil
                    ? await consultarLoja()
                    : await consultarLojaPublica();

            mostrarSaldo(
                perfil?.usuario
            );


            mostrarItens(
                Array.isArray(
                    loja.itens
                )
                    ? loja.itens
                    : []
            );


        } catch (erro) {

            console.error(
                "Erro ao carregar loja:",
                erro
            );


            if (saldoEcoMoedas) {

                saldoEcoMoedas.textContent =
                    "--";

            }


            if (listaLoja) {

                listaLoja.replaceChildren();


                const mensagem =
                    document.createElement(
                        "p"
                    );


                mensagem.className =
                    "loja-vazia";


                mensagem.textContent =
                    erro.message ||
                    "Não foi possível carregar os itens.";


                listaLoja.appendChild(
                    mensagem
                );

            }

        }

    }


    // =========================================================
    // CLIQUES DA LOJA
    // =========================================================

    if (listaLoja) {

        listaLoja.addEventListener(
            "click",
            evento => {

                const comprar =
                    evento.target.closest(
                        ".btn-comprar-item"
                    );


                if (comprar) {

                    const itemId =
                        Number(
                            comprar.dataset.itemId
                        );


                    if (itemId) {

                        comprarItem(
                            itemId,
                            comprar
                        );

                    }


                    return;

                }


                const equipar =
                    evento.target.closest(
                        ".btn-equipar-item"
                    );


                if (equipar) {

                    const itemId =
                        Number(
                            equipar.dataset.itemId
                        );


                    if (itemId) {

                        equiparItem(
                            itemId,
                            equipar
                        );

                    }


                    return;

                }


                const desequipar =
                    evento.target.closest(
                        ".btn-desequipar-item"
                    );


                if (desequipar) {

                    const itemId =
                        Number(
                            desequipar.dataset.itemId
                        );


                    if (itemId) {

                        desequiparItem(
                            itemId,
                            desequipar
                        );

                    }

                }

            }
        );

    }


    // =========================================================
    // MODAL
    // =========================================================

    if (btnModalCompra) {

        btnModalCompra.addEventListener(
            "click",
            fecharModalCompra
        );

    }


    if (modalCompraFundo) {

        modalCompraFundo.addEventListener(
            "click",
            fecharModalCompra
        );

    }


    document.addEventListener(
        "keydown",
        evento => {

            if (
                evento.key === "Escape" &&
                modalCompra &&
                !modalCompra.hidden
            ) {

                fecharModalCompra();

            }

        }
    );


    // =========================================================
    // INICIALIZAÇÃO
    // =========================================================

    carregarLoja();

})();