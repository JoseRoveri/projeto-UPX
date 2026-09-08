// ========================================
// RANKING ECOENERGIA
// ========================================

(() => {

    // ========================================
    // ELEMENTOS
    // ========================================

    const listaRanking =
        document.getElementById(
            "ranking-lista"
        );

    const meuXp =
        document.getElementById(
            "meu-xp"
        );

    const minhaPosicao =
        document.getElementById(
            "minha-posicao"
        );

    const jogadoresCount =
        document.getElementById(
            "jogadores-count"
        );

    const totalJogadores =
        document.getElementById(
            "total-jogadores"
        );

    const barraLiga =
        document.getElementById(
            "barra-liga"
        );

    const xpProximaLiga =
        document.getElementById(
            "xp-proxima-liga"
        );

    const textoProgresso =
        document.getElementById(
            "texto-progresso"
        );

    const ultimaAtualizacao =
        document.getElementById(
            "ultima-atualizacao"
        );


    // ========================================
    // USUÁRIO LOGADO
    // ========================================

    const rankingUsuarioSalvo =
        localStorage.getItem(
            "ecoUsuario"
        );

    let usuarioLogadoRanking = null;


    if (rankingUsuarioSalvo) {

        try {

            usuarioLogadoRanking =
                JSON.parse(
                    rankingUsuarioSalvo
                );

        } catch (erro) {

            console.error(
                "Erro ao carregar usuário:",
                erro
            );

        }

    }


    // ========================================
    // JOGADORES
    // ========================================

    let jogadoresRanking = [];


    // ========================================
    // BUSCAR RANKING NO BANCO
    // ========================================

    async function carregarRanking() {

        try {

            console.log(
                "Buscando ranking..."
            );


            const resposta =
                await fetch(
                    "http://localhost:3000/api/ranking",
                    {
                        cache: "no-store"
                    }
                );


            const dados =
                await resposta.json();


            console.log(
                "Resposta do ranking:",
                dados
            );


            if (!resposta.ok) {

                console.error(
                    "Erro da API:",
                    dados.mensagem
                );

                return;
            }


            if (
                !Array.isArray(
                    dados.jogadores
                )
            ) {

                console.error(
                    "A API não retornou uma lista de jogadores.",
                    dados
                );

                return;
            }


            jogadoresRanking =
                dados.jogadores;


            console.log(
                "Jogadores recebidos:",
                jogadoresRanking
            );


            mostrarRanking();

            atualizarUsuario();

            atualizarInformacoes();


        } catch (erro) {

            console.error(
                "Erro ao carregar ranking:",
                erro
            );

        }

    }


    // ========================================
    // AVATAR
    // ========================================

    function escolherAvatar(
        jogador
    ) {

        if (
            jogador.tipo ===
            "professor"
        ) {

            return "👩‍🏫";

        }


        if (
            jogador.tipo ===
            "responsavel"
        ) {

            return "👤";

        }


        return "🧑‍🎓";

    }


    // ========================================
    // VERIFICAR USUÁRIO ATUAL
    // ========================================

    function ehUsuarioAtual(
        jogador
    ) {

        if (
            !usuarioLogadoRanking
        ) {

            return false;

        }


        return (
            String(
                jogador.id
            ) ===
            String(
                usuarioLogadoRanking.id
            )
        );

    }


    // ========================================
    // MOSTRAR RANKING
    // ========================================

    function mostrarRanking() {

        if (!listaRanking) {

            console.error(
                "Elemento #ranking-lista não encontrado."
            );

            return;
        }


        listaRanking.innerHTML =
            "";


        if (
            jogadoresRanking.length ===
            0
        ) {

            listaRanking.innerHTML = `
                <p>
                    Nenhum jogador no ranking ainda.
                </p>
            `;

            return;

        }


        jogadoresRanking.forEach(
            (
                jogador,
                indice
            ) => {

                const posicao =
                    indice + 1;


                const item =
                    document.createElement(
                        "div"
                    );


                item.classList.add(
                    "ranking-jogador"
                );


                const usuarioAtual =
                    ehUsuarioAtual(
                        jogador
                    );


                if (usuarioAtual) {

                    item.classList.add(
                        "jogador-atual"
                    );

                }


                // ========================================
                // POSIÇÃO / MEDALHA
                // ========================================

                let medalha =
                    posicao;


                if (
                    posicao === 1
                ) {

                    medalha =
                        "🥇";

                }

                else if (
                    posicao === 2
                ) {

                    medalha =
                        "🥈";

                }

                else if (
                    posicao === 3
                ) {

                    medalha =
                        "🥉";

                }


                const xpJogador =
                    Number(
                        jogador.xp
                    ) || 0;


                // ========================================
                // HTML
                // ========================================

                item.innerHTML = `

                    <div class="posicao-ranking">

                        ${medalha}

                    </div>


                    <div class="avatar-ranking">

                        ${escolherAvatar(
                            jogador
                        )}

                    </div>


                    <div class="nome-ranking">

                        <strong>

                            ${jogador.nome}

                            ${
                                usuarioAtual
                                    ? " 👈"
                                    : ""
                            }

                        </strong>


                        <small>

                            ${
                                usuarioAtual
                                    ? "Você"
                                    : "EcoEnergia"
                            }

                        </small>

                    </div>


                    <div class="xp-ranking">

                        ⭐ ${xpJogador} XP

                    </div>

                `;


                listaRanking.appendChild(
                    item
                );

            }
        );

    }


    // ========================================
    // ATUALIZAR USUÁRIO
    // ========================================

    function atualizarUsuario() {

        if (
            !usuarioLogadoRanking
        ) {

            if (meuXp) {

                meuXp.textContent =
                    "--";

            }


            if (minhaPosicao) {

                minhaPosicao.textContent =
                    "--";

            }


            if (textoProgresso) {

                textoProgresso.textContent =
                    "Faça login para acompanhar sua evolução.";

            }

            return;

        }


        const indiceUsuario =
            jogadoresRanking.findIndex(
                jogador =>
                    ehUsuarioAtual(
                        jogador
                    )
            );


        if (
            indiceUsuario === -1
        ) {

            console.warn(
                "Usuário logado não encontrado no ranking.",
                usuarioLogadoRanking
            );


            if (meuXp) {

                meuXp.textContent =
                    "0 XP";

            }


            if (minhaPosicao) {

                minhaPosicao.textContent =
                    "--";

            }

            return;

        }


        const usuario =
            jogadoresRanking[
                indiceUsuario
            ];


        const posicao =
            indiceUsuario + 1;


        const xp =
            Number(
                usuario.xp
            ) || 0;


        console.log(
            "Usuário encontrado no ranking:",
            usuario
        );


        console.log(
            "XP real do usuário:",
            xp
        );


        if (meuXp) {

            meuXp.textContent =
                `${xp} XP`;

        }


        if (minhaPosicao) {

            minhaPosicao.textContent =
                `#${posicao}`;

        }


        atualizarProgresso(
            xp
        );


        // ========================================
        // ATUALIZAR USUÁRIO LOCAL
        // ========================================

        usuarioLogadoRanking.xp =
            xp;


        localStorage.setItem(
            "ecoUsuario",
            JSON.stringify(
                usuarioLogadoRanking
            )
        );

    }


    // ========================================
    // PROGRESSO DE XP
    // ========================================

    function atualizarProgresso(
        xp
    ) {

        const tamanhoMarco =
            100;


        const marcoAtual =
            Math.floor(
                xp /
                tamanhoMarco
            ) *
            tamanhoMarco;


        const proximoMarco =
            marcoAtual +
            tamanhoMarco;


        const xpDentroDoMarco =
            xp -
            marcoAtual;


        const progresso =
            (
                xpDentroDoMarco /
                tamanhoMarco
            ) *
            100;


        const faltam =
            proximoMarco -
            xp;


        if (barraLiga) {

            barraLiga.style.width =
                `${progresso}%`;

        }


        if (xpProximaLiga) {

            xpProximaLiga.textContent =
                `${proximoMarco} XP`;

        }


        if (textoProgresso) {

            textoProgresso.textContent =
                `Faltam ${faltam} XP para alcançar ${proximoMarco} XP.`;

        }

    }


    // ========================================
    // INFORMAÇÕES GERAIS
    // ========================================

    function atualizarInformacoes() {

        const quantidade =
            jogadoresRanking.length;


        if (jogadoresCount) {

            jogadoresCount.textContent =
                quantidade === 1
                    ? "1 jogador"
                    : `${quantidade} jogadores`;

        }


        if (totalJogadores) {

            totalJogadores.textContent =
                quantidade;

        }


        atualizarHorario();

    }


    // ========================================
    // HORÁRIO
    // ========================================

    function atualizarHorario() {

        if (
            !ultimaAtualizacao
        ) {

            return;

        }


        const agora =
            new Date();


        const horario =
            agora.toLocaleTimeString(
                "pt-BR",
                {
                    hour:
                        "2-digit",

                    minute:
                        "2-digit",

                    second:
                        "2-digit"
                }
            );


        ultimaAtualizacao.textContent =
            horario;

    }


    // ========================================
    // ATUALIZAÇÃO AUTOMÁTICA
    // ========================================

    setInterval(
        carregarRanking,
        5000
    );


    // ========================================
    // ATUALIZAR AO VOLTAR PARA A ABA
    // ========================================

    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.visibilityState ===
                "visible"
            ) {

                carregarRanking();

            }

        }
    );


    // ========================================
    // INICIALIZAÇÃO
    // ========================================

    carregarRanking();

})();