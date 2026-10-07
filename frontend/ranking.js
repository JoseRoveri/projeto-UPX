"use strict";

(() => {

    // ========================================
    // API
    // ========================================

    const API = "http://127.0.0.1:3000/api";


    // ========================================
    // ELEMENTOS
    // ========================================

    const meuXp =
        document.getElementById("meu-xp");

    const minhaLiga =
        document.getElementById("minha-liga");

    const minhaSequencia =
        document.getElementById("minha-sequencia");

    const minhasMoedas =
        document.getElementById("minhas-moedas");

    const barraRecompensa =
        document.getElementById("barra-recompensa");

    const xpProximaRecompensa =
        document.getElementById("xp-proxima-recompensa");

    const textoProgresso =
        document.getElementById("texto-progresso");

    const ultimaAtualizacao =
        document.getElementById("ultima-atualizacao");

    const recompensasCount =
        document.getElementById("recompensas-count");

    const recompensasLista =
        document.getElementById("recompensas-lista");

    const modalRecompensa =
        document.getElementById("modal-recompensa");

    const modalRecompensaFundo =
        document.getElementById("modal-recompensa-fundo");

    const modalRecompensaNome =
        document.getElementById("modal-recompensa-nome");

    const modalRecompensaQuantidade =
        document.getElementById("modal-recompensa-quantidade");

    const btnReceberRecompensa =
        document.getElementById("btn-receber-recompensa");

    const btnFecharRecompensa =
        document.getElementById("btn-fechar-recompensa");


    // ========================================
    // RECOMPENSAS
    //
    // Por enquanto usamos os mesmos valores
    // cadastrados no PostgreSQL.
    // Depois podemos buscar isso pelo backend.
    // ========================================


    let recompensas = [];



    // ========================================
    // CONSULTA AO BACKEND
    // ========================================

    async function consultarPerfil() {

        const resposta = await fetch(
            API + "/perfil",
            {
                credentials: "include",
                cache: "no-store"
            }
        );

        const dados =
            await resposta.json()
                .catch(() => ({}));

        if (!resposta.ok) {

            const erro =
                new Error(
                    dados.mensagem ||
                    "Não foi possível carregar sua jornada."
                );

            erro.status = resposta.status;

            throw erro;
        }

        return dados;
    }

    async function consultarRecompensas() {

        const resposta = await fetch(
            API + "/recompensas",
            {
                credentials: "include",
                cache: "no-store"
            }
        );

        const dados =
            await resposta.json()
                .catch(() => ({}));

        if (!resposta.ok) {

            const erro =
                new Error(
                    dados.mensagem ||
                    "Não foi possível carregar as recompensas."
                );

            erro.status = resposta.status;

            throw erro;
        }

        return dados;
    }


    // ========================================
    // RESUMO
    // ========================================

    function atualizarResumo(usuario) {

        const xp =
            Number(usuario.xp) || 0;

        const moedas =
            Number(usuario.moedas) || 0;

        const sequencia =
            Number(usuario.sequencia) || 0;


        if (meuXp) {

            meuXp.textContent =
                `${xp.toLocaleString("pt-BR")} XP`;
        }


        if (minhaLiga) {

            minhaLiga.textContent =
                usuario.liga || "Bronze";
        }


        if (minhaSequencia) {

            minhaSequencia.textContent =
                sequencia === 1
                    ? "1 dia"
                    : `${sequencia} dias`;
        }


        if (minhasMoedas) {

            minhasMoedas.textContent =
                moedas.toLocaleString("pt-BR");
        }


        atualizarProgresso(xp);

        mostrarRecompensas(xp);

    }

    // ========================================
    // MODAL DE RECOMPENSA
    // ========================================

    function abrirModalRecompensa(recompensa) {

        if (!modalRecompensa) {
            return;
        }

        if (modalRecompensaNome) {
            modalRecompensaNome.textContent =
                recompensa.nome;
        }

        if (modalRecompensaQuantidade) {
            modalRecompensaQuantidade.textContent =
                `+${recompensa.moedas}`;
        }

        modalRecompensa.dataset.recompensaId =
            recompensa.id;

        modalRecompensa.hidden = false;
    }


    function fecharModalRecompensa() {

        if (!modalRecompensa) {
            return;
        }

        modalRecompensa.hidden = true;

        delete modalRecompensa.dataset.recompensaId;
    }

    async function resgatarRecompensa() {

        if (!modalRecompensa) {
            return;
        }

        const recompensaId =
            Number(modalRecompensa.dataset.recompensaId);

        if (!recompensaId) {
            return;
        }


        if (btnReceberRecompensa) {

            btnReceberRecompensa.disabled = true;
            btnReceberRecompensa.textContent =
                "Recebendo...";
        }


        try {

            const resposta = await fetch(
                `${API}/recompensas/${recompensaId}/resgatar`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );


            const dados =
                await resposta.json()
                    .catch(() => ({}));


            if (!resposta.ok) {

                throw new Error(
                    dados.mensagem ||
                    "Não foi possível receber a recompensa."
                );
            }


            // Atualiza o saldo imediatamente.
            if (minhasMoedas) {

                minhasMoedas.textContent =
                    Number(
                        dados.moedasTotal || 0
                    ).toLocaleString("pt-BR");
            }


            fecharModalRecompensa();


            // Atualiza toda a jornada para mostrar
            // a recompensa como recebida.
            await carregarJornada();


        } catch (erro) {

            console.error(
                "Erro ao receber recompensa:",
                erro
            );

            alert(
                erro.message ||
                "Não foi possível receber a recompensa."
            );

        } finally {

            if (btnReceberRecompensa) {

                btnReceberRecompensa.disabled = false;
                btnReceberRecompensa.textContent =
                    "Receber 🎁";
            }
        }
    }

    if (recompensasLista) {

        recompensasLista.addEventListener(
            "click",
            evento => {

                const botao =
                    evento.target.closest(
                        ".btn-resgatar-recompensa"
                    );

                if (!botao) {
                    return;
                }

                const recompensaId =
                    Number(botao.dataset.recompensaId);

                const recompensa =
                    recompensas.find(
                        item =>
                            Number(item.id) === recompensaId
                    );

                if (
                    !recompensa ||
                    recompensa.status !== "liberada"
                ) {
                    return;
                }

                abrirModalRecompensa(
                    recompensa
                );
            }
        );
    }


    if (btnFecharRecompensa) {

        btnFecharRecompensa.addEventListener(
            "click",
            fecharModalRecompensa
        );
    }


    if (modalRecompensaFundo) {

        modalRecompensaFundo.addEventListener(
            "click",
            fecharModalRecompensa
        );
    }

    if (btnReceberRecompensa) {

        btnReceberRecompensa.addEventListener(
            "click",
            resgatarRecompensa
        );
    }


    // ========================================
    // PROGRESSO ATÉ A PRÓXIMA RECOMPENSA
    // ========================================

    function atualizarProgresso(xp) {

        const proxima =
            recompensas.find(
                recompensa =>
                    xp < recompensa.xp
            );


        // Todas as recompensas atingidas.
        if (!proxima) {

            if (barraRecompensa) {

                barraRecompensa.style.width =
                    "100%";
            }


            if (xpProximaRecompensa) {

                xpProximaRecompensa.textContent =
                    "Todos os marcos alcançados!";
            }


            if (textoProgresso) {

                textoProgresso.textContent =
                    "Você alcançou todos os marcos atuais da sua jornada. 🌟";
            }

            return;
        }


        const indiceProxima =
            recompensas.indexOf(proxima);


        const marcoAnterior =
            indiceProxima > 0
                ? recompensas[indiceProxima - 1].xp
                : 0;


        const tamanhoIntervalo =
            proxima.xp - marcoAnterior;


        const xpNoIntervalo =
            Math.max(
                0,
                xp - marcoAnterior
            );


        const porcentagem =
            Math.min(
                100,
                Math.max(
                    0,
                    (xpNoIntervalo / tamanhoIntervalo) * 100
                )
            );


        const faltam =
            Math.max(
                0,
                proxima.xp - xp
            );


        if (barraRecompensa) {

            barraRecompensa.style.width =
                `${porcentagem}%`;
        }


        if (xpProximaRecompensa) {

            xpProximaRecompensa.textContent =
                `${proxima.xp.toLocaleString("pt-BR")} XP`;
        }


        if (textoProgresso) {

            textoProgresso.textContent =
                `Faltam ${faltam.toLocaleString("pt-BR")} XP para ganhar +${proxima.moedas} EcoMoedas.`;
        }
    }


    // ========================================
    // LISTA DE RECOMPENSAS
    // ========================================

    function mostrarRecompensas(xp) {

        if (!recompensasLista) {
            return;
        }


        recompensasLista.replaceChildren();


        const alcancadas =
            recompensas.filter(recompensa =>
                recompensa.status === "liberada" ||
                recompensa.status === "recebida"
            ).length;


        if (recompensasCount) {

            recompensasCount.textContent =
                `${alcancadas} de ${recompensas.length} marcos`;
        }


        recompensas.forEach(recompensa => {

            const statusRecompensa =
                recompensa.status || "bloqueada";


            const item =
                document.createElement("div");

            item.className =
                `ranking-jogador recompensa-${statusRecompensa}`;


            // ========================================
            // STATUS
            // ========================================

            const status =
                document.createElement("div");

            status.className =
                "posicao-ranking";


            if (statusRecompensa === "recebida") {

                status.textContent = "✅";

            } else if (statusRecompensa === "liberada") {

                status.textContent = "🎁";

            } else {

                status.textContent = "🔒";
            }


            // ========================================
            // MOEDA
            // ========================================

            const presente =
                document.createElement("div");

            presente.className =
                "avatar-ranking avatar-moeda";


            const imagemMoeda =
                document.createElement("img");

            imagemMoeda.src =
                "imagens/moeda.png";

            imagemMoeda.alt =
                "EcoMoeda";

            imagemMoeda.className =
                "imagem-moeda-recompensa";


            presente.appendChild(
                imagemMoeda
            );


            // ========================================
            // INFORMAÇÕES
            // ========================================

            const informacoes =
                document.createElement("div");

            informacoes.className =
                "nome-ranking";


            const nome =
                document.createElement("strong");

            nome.textContent =
                recompensa.nome;


            const descricao =
                document.createElement("small");


            if (statusRecompensa === "recebida") {

                descricao.textContent =
                    `Você já recebeu ${recompensa.moedas} EcoMoedas.`;

            } else if (statusRecompensa === "liberada") {

                descricao.textContent =
                    `Recompensa liberada! Você ganhou ${recompensa.moedas} EcoMoedas.`;

            } else {

                descricao.textContent =
                    `Chegue a ${Number(recompensa.xp).toLocaleString("pt-BR")} XP para liberar esta recompensa.`;
            }


            informacoes.append(
                nome,
                descricao
            );


            // ========================================
            // LADO DIREITO
            // ========================================

            let ladoDireito;


            if (statusRecompensa === "liberada") {

                const botao =
                    document.createElement("button");

                botao.type =
                    "button";

                botao.className =
                    "btn-resgatar-recompensa";

                botao.textContent =
                    "Resgatar";

                botao.dataset.recompensaId =
                    recompensa.id;


                ladoDireito =
                    botao;

            } else {

                const premio =
                    document.createElement("div");

                premio.className =
                    "xp-ranking premio-moeda";

                premio.textContent =
                    `${recompensa.moedas}`;


                ladoDireito =
                    premio;
            }


            item.append(
                status,
                presente,
                informacoes,
                ladoDireito
            );


            recompensasLista.appendChild(
                item
            );
        });
    }


    // ========================================
    // HORÁRIO
    // ========================================

    function atualizarHorario() {

        if (!ultimaAtualizacao) {
            return;
        }


        const agora =
            new Date();


        ultimaAtualizacao.textContent =
            agora.toLocaleTimeString(
                "pt-BR",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );
    }


    // ========================================
    // ERRO / SEM LOGIN
    // ========================================

    function mostrarErro(erro) {

        if (meuXp) {
            meuXp.textContent = "--";
        }

        if (minhaLiga) {
            minhaLiga.textContent = "--";
        }

        if (minhaSequencia) {
            minhaSequencia.textContent = "--";
        }

        if (minhasMoedas) {
            minhasMoedas.textContent = "--";
        }

        if (barraRecompensa) {
            barraRecompensa.style.width = "0%";
        }


        if (textoProgresso) {

            textoProgresso.textContent =
                erro.status === 401
                    ? "Faça login para acompanhar sua jornada."
                    : erro.message;
        }


        if (xpProximaRecompensa) {

            xpProximaRecompensa.textContent =
                "--";
        }


        if (recompensasCount) {

            recompensasCount.textContent =
                "--";
        }


        if (recompensasLista) {

            recompensasLista.replaceChildren();


            const aviso =
                document.createElement("p");


            aviso.textContent =
                erro.status === 401
                    ? "Entre na sua conta para visualizar suas recompensas."
                    : "Não foi possível carregar suas recompensas.";


            recompensasLista.appendChild(
                aviso
            );
        }
    }

    // ========================================
    // CARREGAR JORNADA
    // ========================================

    async function carregarJornada() {

        try {

            const [
                dadosPerfil,
                dadosRecompensas
            ] = await Promise.all([
                consultarPerfil(),
                consultarRecompensas()
            ]);


            if (!dadosPerfil.usuario) {

                throw new Error(
                    "O perfil não retornou os dados do usuário."
                );
            }


            recompensas =
                Array.isArray(dadosRecompensas.recompensas)
                    ? dadosRecompensas.recompensas
                    : [];


            atualizarResumo(
                dadosPerfil.usuario
            );


            atualizarHorario();


            try {

                localStorage.setItem(
                    "ecoUsuario",
                    JSON.stringify(
                        dadosPerfil.usuario
                    )
                );

            } catch { }


        } catch (erro) {

            console.error(
                "Erro ao carregar Minha Jornada:",
                erro
            );


            mostrarErro(erro);
        }
    }

    // ========================================
    // ATUALIZA AO VOLTAR PARA A ABA
    // ========================================

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState ===
                "visible"
            ) {

                carregarJornada();
            }
        }
    );


    // ========================================
    // INICIALIZAÇÃO
    // ========================================

    carregarJornada();


})();