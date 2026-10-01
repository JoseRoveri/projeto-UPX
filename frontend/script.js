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
        // Impede o formulário de recarregar a página.
        evento.preventDefault();

        const email = document.querySelector("#usuario").value.trim();
        const senha = document.querySelector("#senha").value;

        try {
            // Envia os dados ao backend.
            const resposta = await fetch(
                "http://127.0.0.1:3000/api/login",
                {
                    method: "POST",
                    credentials: "include",

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

            // Mostra a mensagem caso o backend recuse o login.
            if (!resposta.ok) {
                alert(dados.mensagem || "Não foi possível entrar.");
                return;
            }

            // Guarda dados para exibir na interface.
            // Isso não substitui a validação da sessão no backend.
            localStorage.setItem(
                "ecoUsuario",
                JSON.stringify(dados.usuario)
            );

            // Abre a página principal.
            window.location.href = "index.html";
        } catch (erro) {
            console.error("Erro ao realizar login:", erro);
            alert("Não foi possível concluir o login.");
        }
    });
}


// ========================================
// 15. CONSULTAR USUÁRIO LOGADO
// ========================================

const nomeUsuario = document.querySelector("#nome-usuario");
const sequenciaUsuario = document.querySelector("#sequencia-usuario");

const headerVisitante = document.querySelector("#header-visitante");
const headerLogado = document.querySelector("#header-logado");

async function carregarUsuarioAtual() {
    // Executa nas páginas que possuem esses elementos.
    if (
        !nomeUsuario &&
        !sequenciaUsuario &&
        !headerVisitante &&
        !headerLogado
    ) {
        return;
    }

    let usuario = null;

    try {
        const resposta = await fetch(
            "http://127.0.0.1:3000/api/me",
            {
                credentials: "include",
                cache: "no-store"
            }
        );

        // Se receber 401, continua como visitante.
        if (resposta.status !== 401) {
            if (!resposta.ok) {
                throw new Error("Não foi possível consultar a sessão.");
            }

            const dados = await resposta.json();

            if (
                !dados.usuario ||
                typeof dados.usuario.nome !== "string"
            ) {
                throw new Error("Dados do usuário inválidos.");
            }

            usuario = dados.usuario;
        }
    } catch (erro) {
        console.error("Erro ao consultar usuário:", erro);
        return;
    }

    const estaLogado = usuario !== null;

    // Esconde os botões de acesso quando há uma sessão válida.
    if (headerVisitante) {
        headerVisitante.hidden = estaLogado;
    }

    // Mostra nome, sequência e botão Sair.
    if (headerLogado) {
        headerLogado.hidden = !estaLogado;
    }

    if (nomeUsuario) {
        if (estaLogado) {
            const primeiroNome = usuario.nome.trim().split(/\s+/)[0];
            nomeUsuario.textContent = `Olá, ${primeiroNome}!`;
        } else {
            nomeUsuario.textContent = "Olá, visitante!";
        }
    }

    if (sequenciaUsuario) {
        const sequencia = estaLogado
            ? Number(usuario.sequencia) || 0
            : 0;

        sequenciaUsuario.textContent = `🔥 ${sequencia}`;
    }

    // Mantém a cópia local usada por outras partes da interface.
    try {
        if (estaLogado) {
            localStorage.setItem(
                "ecoUsuario",
                JSON.stringify(usuario)
            );
        } else {
            localStorage.removeItem("ecoUsuario");
            localStorage.removeItem("ecoNivel");
        }
    } catch (erro) {
        console.warn("Não foi possível atualizar os dados locais:", erro);
    }
}

carregarUsuarioAtual();


// ========================================
// 16. MINI RANKING DA PÁGINA INICIAL
// ========================================

const miniRanking = document.querySelector("#mini-ranking");
const miniRankingPosicao = document.querySelector("#mini-ranking-posicao");

if (miniRanking && miniRankingPosicao) {
    async function carregarMiniRanking() {
        let jogadores = [];

        miniRanking.textContent = "";
        miniRankingPosicao.textContent = "Carregando ranking...";

        try {
            // Busca a classificação no backend.
            const resposta = await fetch(
                "http://127.0.0.1:3000/api/ranking"
            );

            if (!resposta.ok) {
                throw new Error("Não foi possível carregar o ranking.");
            }

            const dados = await resposta.json();
            jogadores = dados.jogadores;

            if (jogadores.length === 0) {
                miniRankingPosicao.textContent =
                    "Ainda não há jogadores cadastrados.";
                return;
            }

            // Monta os cartões dos três primeiros colocados.
            const medalhas = ["🥇", "🥈", "🥉"];

            jogadores.slice(0, 3).forEach((jogador, indice) => {
                const card = document.createElement("div");
                card.className = "ranking-mini-card";

                const medalha = document.createElement("span");
                medalha.textContent = medalhas[indice];

                const nome = document.createElement("strong");
                nome.textContent = jogador.nome;

                const pontos = document.createElement("b");
                pontos.textContent = `${jogador.xp} XP`;

                card.append(medalha, nome, pontos);
                miniRanking.appendChild(card);
            });
        } catch (erro) {
            console.error("Erro ao carregar ranking:", erro);

            miniRankingPosicao.textContent =
                "Não foi possível carregar o ranking.";
            return;
        }

        try {
            // Confirma quem está conectado para mostrar sua posição.
            const respostaSessao = await fetch(
                "http://127.0.0.1:3000/api/me",
                {
                    credentials: "include"
                }
            );

            if (respostaSessao.status === 401) {
                miniRankingPosicao.textContent =
                    "Faça login para ver sua posição.";
                return;
            }

            if (!respostaSessao.ok) {
                throw new Error("Não foi possível consultar a sessão.");
            }

            const dadosSessao = await respostaSessao.json();
            const usuario = dadosSessao.usuario;

            const indiceUsuario = jogadores.findIndex(
                jogador => jogador.id === usuario.id
            );

            if (indiceUsuario === -1) {
                miniRankingPosicao.textContent =
                    "Sua posição ainda não foi encontrada.";
                return;
            }

            miniRankingPosicao.textContent =
                `🔥 Você está em ${indiceUsuario + 1}º lugar!`;
        } catch (erro) {
            console.error("Erro ao consultar posição:", erro);

            miniRankingPosicao.textContent =
                "Não foi possível consultar sua posição.";
        }
    }

    carregarMiniRanking();
}

// ========================================
// 17. LOGOUT
// ========================================

const btnSair = document.getElementById("btn-sair");

if (btnSair) {
    btnSair.addEventListener("click", async function (evento) {
        // Aguarda o logout antes de mudar de página.
        evento.preventDefault();

        try {
            const resposta = await fetch(
                "http://127.0.0.1:3000/api/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.mensagem || "Não foi possível sair.");
                return;
            }

            // Limpa os dados usados pela interface.
            localStorage.removeItem("ecoUsuario");

            window.location.href = "index.html";
        } catch (erro) {
            console.error("Erro ao fazer logout:", erro);
            alert("Não foi possível concluir a saída. Tente novamente.");
        }
    });
}