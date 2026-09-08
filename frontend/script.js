// ========================================
// ECOENERGIA - ANIMAÇÕES E INTERAÇÕES
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // 1. ANIMAÇÃO DE ENTRADA
    // ========================================

    document.body.classList.add("pagina-carregada");


    // ========================================
    // 2. ELEMENTOS APARECENDO AO ROLAR
    // ========================================

    const elementos = document.querySelectorAll(
        "section, article, .hero, .card, footer"
    );

    elementos.forEach(elemento => {
        elemento.classList.add("animar-scroll");
    });

    const observador = new IntersectionObserver(
        (entradas) => {

            entradas.forEach(entrada => {

                if (entrada.isIntersecting) {

                    entrada.target.classList.add("visivel");

                    // Depois que apareceu, não precisa observar novamente
                    observador.unobserve(entrada.target);
                }

            });

        },
        {
            threshold: 0.15
        }
    );

    elementos.forEach(elemento => {
        observador.observe(elemento);
    });


    // ========================================
    // 3. ANIMAÇÃO DOS CARDS EM SEQUÊNCIA
    // ========================================

    const cards = document.querySelectorAll("article");

    cards.forEach((card, index) => {

        card.style.transitionDelay = `${index * 0.12}s`;

    });


    // ========================================
    // 4. EFEITO NOS BOTÕES
    // ========================================

    const botoes = document.querySelectorAll(
        "button, a"
    );

    botoes.forEach(botao => {

        botao.addEventListener("mouseenter", () => {
            botao.classList.add("botao-hover");
        });

        botao.addEventListener("mouseleave", () => {
            botao.classList.remove("botao-hover");
        });

    });


    // ========================================
    // 5. EFEITO DE CLIQUE
    // ========================================

    botoes.forEach(botao => {

        botao.addEventListener("click", function () {

            this.classList.add("clicado");

            setTimeout(() => {
                this.classList.remove("clicado");
            }, 250);

        });

    });


    // ========================================
    // 6. ÍCONES FLUTUANDO
    // ========================================

    const icones = document.querySelectorAll(
        "section span, aside span"
    );

    icones.forEach((icone, index) => {

        if (
            icone.textContent.includes("💧") ||
            icone.textContent.includes("⚡") ||
            icone.textContent.includes("🌱")
        ) {

            icone.classList.add("icone-flutuante");

            icone.style.animationDelay =
                `${index * 0.25}s`;
        }

    });


    // ========================================
    // 7. EFEITO PARALLAX SUAVE
    // ========================================

    const elementosParallax = document.querySelectorAll(
        ".hero-visual, .visual, aside"
    );

    window.addEventListener("scroll", () => {

        const scroll = window.scrollY;

        elementosParallax.forEach(elemento => {

            if (window.innerWidth > 768) {

                elemento.style.transform =
                    `translateY(${scroll * 0.03}px)`;

            }

        });

    });


    // ========================================
    // 8. BOTÃO VOLTAR AO TOPO
    // ========================================

    const botaoTopo = document.createElement("button");

    botaoTopo.innerHTML = "↑";

    botaoTopo.className = "botao-topo";

    botaoTopo.setAttribute(
        "aria-label",
        "Voltar ao topo"
    );

    document.body.appendChild(botaoTopo);


    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            botaoTopo.classList.add("mostrar");

        } else {

            botaoTopo.classList.remove("mostrar");

        }

    });


    botaoTopo.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    // ========================================
    // 9. LINKS INTERNOS COM SCROLL SUAVE
    // ========================================

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (evento) {

            const destino = document.querySelector(
                this.getAttribute("href")
            );

            if (destino) {

                evento.preventDefault();

                destino.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    // ========================================
    // 10. EFEITO DE DESTAQUE AO CHEGAR
    // NO TESTE DE NÍVEL
    // ========================================

    const teste = document.querySelector("#teste");

    if (teste) {

        const observadorTeste = new IntersectionObserver(
            (entradas) => {

                entradas.forEach(entrada => {

                    if (entrada.isIntersecting) {

                        teste.classList.add(
                            "teste-destaque"
                        );

                        setTimeout(() => {

                            teste.classList.remove(
                                "teste-destaque"
                            );

                        }, 1200);

                        observadorTeste.unobserve(teste);

                    }

                });

            },
            {
                threshold: 0.4
            }
        );

        observadorTeste.observe(teste);

    }


    // ========================================
    // 11. CONFETES
    // ========================================

    window.comemorar = function () {

        const quantidade = 35;

        for (let i = 0; i < quantidade; i++) {

            const confete =
                document.createElement("div");

            confete.className = "confete";

            confete.style.left =
                Math.random() * 100 + "vw";

            confete.style.animationDelay =
                Math.random() * 0.5 + "s";

            confete.style.transform =
                `rotate(${Math.random() * 360}deg)`;

            document.body.appendChild(confete);

            setTimeout(() => {
                confete.remove();
            }, 3000);

        }

    };


    // ========================================
    // 12. MENSAGEM DE BOAS-VINDAS
    // ========================================

    const titulo =
        document.querySelector("#inicio h2");

    if (titulo) {

        titulo.classList.add("titulo-entrada");

    }

});

// ========================================
// 13. CADASTRO REAL COM BANCO DE DADOS
// ========================================

const formularioCadastro = document.querySelector("#form-cadastro");
const cadastroSucesso = document.querySelector("#cadastro-sucesso");

if (formularioCadastro && cadastroSucesso) {

    formularioCadastro.addEventListener("submit", async function (evento) {

        evento.preventDefault();

        const nome = document.querySelector("#nome").value.trim();
        const email = document.querySelector("#email").value.trim();
        const tipo = document.querySelector("#tipo").value;
        const senha = document.querySelector("#senha").value;
        const confirmarSenha =
            document.querySelector("#confirmar-senha").value;

        // Verifica as senhas
        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem.");
            return;
        }

        try {

            const resposta = await fetch(
                "http://localhost:3000/api/cadastro",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        nome: nome,
                        email: email,
                        senha: senha,
                        tipo: tipo
                    })
                }
            );

            const dados = await resposta.json();

            // Se o servidor retornar erro
            if (!resposta.ok) {
                alert(dados.mensagem);
                return;
            }

            // Cadastro confirmado pelo banco
            formularioCadastro.style.display = "none";

            const textoJaPossuiConta =
                formularioCadastro.parentElement.querySelector(
                    ":scope > p"
                );

            if (textoJaPossuiConta) {
                textoJaPossuiConta.style.display = "none";
            }

            cadastroSucesso.classList.remove("escondido");

            cadastroSucesso.classList.add(
                "cadastro-sucesso-aparecer"
            );

        } catch (erro) {

            console.error(
                "Erro ao conectar com o servidor:",
                erro
            );

            alert(
                "Não foi possível conectar ao servidor."
            );
        }
    });
}

// ========================================
// 14. LOGIN REAL
// ========================================

const formularioLogin = document.querySelector("#form-login");

if (formularioLogin) {

    formularioLogin.addEventListener("submit", async function (evento) {

        evento.preventDefault();

        const email = document.querySelector("#usuario").value.trim();
        const senha = document.querySelector("#senha").value;

        try {

            const resposta = await fetch(
                "http://localhost:3000/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        senha: senha
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.mensagem);
                return;
            }

            // Guarda temporariamente os dados do usuário logado
            localStorage.setItem(
                "ecoUsuario",
                JSON.stringify(dados.usuario)
            );

            // Vai para a página principal
            window.location.href = "index.html";

        } catch (erro) {

            console.error(
                "Erro ao realizar login:",
                erro
            );

            alert(
                "Não foi possível conectar ao servidor."
            );
        }
    });
}

// ========================================
// 15. MOSTRAR NOME DO USUÁRIO LOGADO
// ========================================

const usuarioSalvo = localStorage.getItem("ecoUsuario");
const nomeUsuario = document.querySelector("#nome-usuario");

if (usuarioSalvo && nomeUsuario) {

    const usuario = JSON.parse(usuarioSalvo);

    // Pega somente o primeiro nome
    const primeiroNome = usuario.nome.split(" ")[0];

    nomeUsuario.textContent = `Olá, ${primeiroNome}!`;
}

// ========================================
// SEQUÊNCIA DIÁRIA - 24 HORAS
// ========================================

const sequenciaUsuario =
    document.getElementById(
        "sequencia-usuario"
    );


async function atualizarSequenciaUsuario() {

    const usuarioSalvo =
        localStorage.getItem(
            "ecoUsuario"
        );


    if (
        !usuarioSalvo ||
        !sequenciaUsuario
    ) {
        return;
    }


    const usuario =
        JSON.parse(
            usuarioSalvo
        );


    try {

        // ========================================
        // CONSULTAR O BACKEND
        // ========================================

        const resposta =
            await fetch(
                `http://localhost:3000/api/usuario/${usuario.id}/status`
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            console.error(
                "Erro ao atualizar sequência:",
                dados.mensagem
            );

            // Se der algum problema no servidor,
            // mostra pelo menos o valor salvo.

            const sequenciaSalva =
                Number(
                    usuario.sequencia
                ) || 0;


            sequenciaUsuario.textContent =
                `🔥 ${sequenciaSalva}`;

            return;
        }


        // ========================================
        // DADOS ATUALIZADOS DO SERVIDOR
        // ========================================

        const usuarioAtualizado =
            dados.usuario;


        const sequencia =
            Number(
                usuarioAtualizado.sequencia
            ) || 0;


        // Atualiza visualmente
        sequenciaUsuario.textContent =
            `🔥 ${sequencia}`;


        // ========================================
        // ATUALIZAR LOCALSTORAGE
        // ========================================

        usuario.sequencia =
            sequencia;


        usuario.ultimaAtividade =
            usuarioAtualizado.ultimaAtividade;


        usuario.xp =
            usuarioAtualizado.xp;


        localStorage.setItem(
            "ecoUsuario",
            JSON.stringify(
                usuario
            )
        );


        console.log(
            "Sequência atualizada:",
            sequencia
        );


    } catch (erro) {

        console.error(
            "Erro ao verificar sequência:",
            erro
        );


        // ========================================
        // FALLBACK
        // ========================================

        const sequenciaSalva =
            Number(
                usuario.sequencia
            ) || 0;


        sequenciaUsuario.textContent =
            `🔥 ${sequenciaSalva}`;

    }

}


// Executa assim que a página carregar
atualizarSequenciaUsuario();

// ========================================
// 16. MINI RANKING DA PÁGINA INICIAL
// ========================================

const miniRanking = document.querySelector("#mini-ranking");
const miniRankingPosicao =
    document.querySelector("#mini-ranking-posicao");

if (miniRanking && miniRankingPosicao) {

    async function carregarMiniRanking() {

        try {

            const resposta = await fetch(
                "http://localhost:3000/api/ranking"
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                miniRankingPosicao.textContent =
                    "Não foi possível carregar o ranking.";
                return;
            }

            const jogadores = dados.jogadores;

            // Mostra somente os 3 primeiros
            const top3 = jogadores.slice(0, 3);

            miniRanking.innerHTML = "";

            top3.forEach((jogador, indice) => {

                let medalha = "";

                if (indice === 0) {
                    medalha = "🥇";
                }
                else if (indice === 1) {
                    medalha = "🥈";
                }
                else if (indice === 2) {
                    medalha = "🥉";
                }

                const card =
                    document.createElement("div");

                card.classList.add(
                    "ranking-mini-card"
                );

                card.innerHTML = `
                    <span>
                        ${medalha}
                    </span>

                    <strong>
                        ${jogador.nome}
                    </strong>

                    <b>
                        ${jogador.xp} XP
                    </b>
                `;

                miniRanking.appendChild(card);
            });

            // Descobre a posição do usuário logado
            const usuarioSalvo =
                localStorage.getItem("ecoUsuario");

            if (!usuarioSalvo) {

                miniRankingPosicao.textContent =
                    "Faça login para ver sua posição.";

                return;
            }

            const usuario =
                JSON.parse(usuarioSalvo);

            const indiceUsuario =
                jogadores.findIndex(
                    jogador =>
                        jogador.id === usuario.id
                );

            if (indiceUsuario === -1) {

                miniRankingPosicao.textContent =
                    "Sua posição ainda não foi encontrada.";

                return;
            }

            const posicao =
                indiceUsuario + 1;

            miniRankingPosicao.textContent =
                `🔥 Você está em ${posicao}º lugar!`;

        } catch (erro) {

            console.error(
                "Erro ao carregar mini ranking:",
                erro
            );

            miniRankingPosicao.textContent =
                "Erro ao carregar ranking.";
        }
    }

    carregarMiniRanking();
}