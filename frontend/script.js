// ========================================
// ECOENERGIA - ANIMAÇÕES E INTERAÇÕES
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // 1. ANIMAÇÃO DE ENTRADA
    // ========================================

    document.body.classList.add("pagina-carregada");


    // ========================================
    // 2. ELEMENTOS AO ROLAR
    // ========================================

    const elementos = document.querySelectorAll(
        "section, article, .hero, .card, footer"
    );

    elementos.forEach(elemento => {
        elemento.classList.add("animar-scroll");
    });

    const observador = new IntersectionObserver(
        entradas => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visivel");
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
    // 3. CARDS EM SEQUÊNCIA
    // ========================================

    const cards = document.querySelectorAll("article");

    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.12}s`;
    });


    // ========================================
    // 4. HOVER NOS BOTÕES
    // ========================================

    const botoes = document.querySelectorAll("button, a");

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
    // 7. PARALLAX
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
    // 9. SCROLL SUAVE
    // ========================================

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                function (evento) {

                    const seletor =
                        this.getAttribute("href");

                    if (
                        !seletor ||
                        seletor === "#"
                    ) {
                        return;
                    }

                    const destino =
                        document.querySelector(seletor);

                    if (destino) {

                        evento.preventDefault();

                        destino.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                }
            );

        });


    // ========================================
    // 10. TESTE DE NÍVEL
    // ========================================

    const teste = document.querySelector("#teste");

    if (teste) {

        const observadorTeste =
            new IntersectionObserver(
                entradas => {

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

                            observadorTeste.unobserve(
                                teste
                            );

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

        for (
            let i = 0;
            i < quantidade;
            i++
        ) {

            const confete =
                document.createElement("div");

            confete.className =
                "confete";

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
    // 12. TÍTULO
    // ========================================

    const titulo =
        document.querySelector("#inicio h2");

    if (titulo) {
        titulo.classList.add("titulo-entrada");
    }

});


// ========================================
// 13. CADASTRO
// ========================================

const formularioCadastro =
    document.querySelector("#form-cadastro");

if (formularioCadastro) {

    formularioCadastro.addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();

            const nome =
                document
                    .querySelector("#nome")
                    .value
                    .trim();

            const email =
                document
                    .querySelector("#email")
                    .value
                    .trim();

            const tipo =
                document
                    .querySelector("#tipo")
                    .value;

            const senha =
                document
                    .querySelector("#senha")
                    .value;

            const confirmarSenha =
                document
                    .querySelector("#confirmar-senha")
                    .value;

            if (senha !== confirmarSenha) {

                alert(
                    "As senhas não coincidem."
                );

                return;

            }

            try {

                // ========================================
                // CRIAR CONTA
                // ========================================

                const resposta =
                    await fetch(
                        "http://127.0.0.1:3000/api/cadastro",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body:
                                JSON.stringify({
                                    nome: nome,
                                    email: email,
                                    senha: senha,
                                    tipo: tipo
                                })
                        }
                    );

                const dados =
                    await resposta
                        .json()
                        .catch(() => ({}));

                if (!resposta.ok) {

                    alert(
                        dados.mensagem ||
                        "Não foi possível realizar o cadastro."
                    );

                    return;

                }


                // ========================================
                // LOGIN AUTOMÁTICO
                // ========================================

                const respostaLogin =
                    await fetch(
                        "http://127.0.0.1:3000/api/login",
                        {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body:
                                JSON.stringify({
                                    email: email,
                                    senha: senha
                                })
                        }
                    );

                const dadosLogin =
                    await respostaLogin
                        .json()
                        .catch(() => ({}));

                if (!respostaLogin.ok) {

                    alert(
                        dadosLogin.mensagem ||
                        "Sua conta foi criada, mas não foi possível entrar automaticamente."
                    );

                    return;

                }

                if (dadosLogin.usuario) {

                    localStorage.setItem(
                        "ecoUsuario",
                        JSON.stringify(
                            dadosLogin.usuario
                        )
                    );

                }

                window.location.href =
                    "companheiro.html";

            } catch (erro) {

                console.error(
                    "Erro ao realizar cadastro:",
                    erro
                );

                alert(
                    "Não foi possível concluir o cadastro."
                );

            }

        }
    );

}


// ========================================
// VERIFICAR COMPANHEIRO DEPOIS DO LOGIN
// ========================================

async function verificarCompanheiroAposLogin() {

    const resposta =
        await fetch(
            "http://127.0.0.1:3000/api/companheiro",
            {
                credentials: "include",
                cache: "no-store"
            }
        );

    const dados =
        await resposta
            .json()
            .catch(() => ({}));

    if (!resposta.ok) {

        throw new Error(
            dados.mensagem ||
            "Não foi possível verificar o companheiro."
        );

    }

    if (dados.criado === true) {

        window.location.href =
            "index.html";

        return;

    }

    window.location.href =
        "companheiro.html";

}


// ========================================
// 14. LOGIN
// ========================================

const formularioLogin =
    document.querySelector("#form-login");

if (formularioLogin) {

    formularioLogin.addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();

            const email =
                document
                    .querySelector("#usuario")
                    .value
                    .trim();

            const senha =
                document
                    .querySelector("#senha")
                    .value;

            try {

                const resposta =
                    await fetch(
                        "http://127.0.0.1:3000/api/login",
                        {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body:
                                JSON.stringify({
                                    email: email,
                                    senha: senha
                                })
                        }
                    );

                const dados =
                    await resposta
                        .json()
                        .catch(() => ({}));

                if (!resposta.ok) {

                    alert(
                        dados.mensagem ||
                        "Não foi possível entrar."
                    );

                    return;

                }

                if (dados.usuario) {

                    localStorage.setItem(
                        "ecoUsuario",
                        JSON.stringify(
                            dados.usuario
                        )
                    );

                }

                await verificarCompanheiroAposLogin();

            } catch (erro) {

                console.error(
                    "Erro ao realizar login:",
                    erro
                );

                alert(
                    "Não foi possível concluir o login."
                );

            }

        }
    );

}


// ========================================
// 15. CONSULTAR USUÁRIO LOGADO
// ========================================

const nomeUsuario =
    document.querySelector("#nome-usuario");

const sequenciaUsuario =
    document.querySelector("#sequencia-usuario");

const headerVisitante =
    document.querySelector("#header-visitante");

const headerLogado =
    document.querySelector("#header-logado");


async function carregarUsuarioAtual() {

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

        const resposta =
            await fetch(
                "http://127.0.0.1:3000/api/me",
                {
                    credentials: "include",
                    cache: "no-store"
                }
            );

        if (resposta.status !== 401) {

            if (!resposta.ok) {

                throw new Error(
                    "Não foi possível consultar a sessão."
                );

            }

            const dados =
                await resposta.json();

            if (
                !dados.usuario ||
                typeof dados.usuario.nome !==
                "string"
            ) {

                throw new Error(
                    "Dados do usuário inválidos."
                );

            }

            usuario =
                dados.usuario;

        }

    } catch (erro) {

        console.error(
            "Erro ao consultar usuário:",
            erro
        );

        return;

    }

    const estaLogado =
        usuario !== null;


    if (headerVisitante) {

        headerVisitante.hidden =
            estaLogado;

    }


    if (headerLogado) {

        headerLogado.hidden =
            !estaLogado;

    }


    if (nomeUsuario) {

        if (estaLogado) {

            const primeiroNome =
                usuario.nome
                    .trim()
                    .split(/\s+/)[0];

            nomeUsuario.textContent =
                `Olá, ${primeiroNome}!`;

        } else {

            nomeUsuario.textContent =
                "Olá, visitante!";

        }

    }


    if (sequenciaUsuario) {

        const sequencia =
            estaLogado
                ? Number(
                    usuario.sequencia
                ) || 0
                : 0;

        sequenciaUsuario.textContent =
            `🔥 ${sequencia}`;

    }


    try {

        if (estaLogado) {

            localStorage.setItem(
                "ecoUsuario",
                JSON.stringify(usuario)
            );

        } else {

            localStorage.removeItem(
                "ecoUsuario"
            );

            localStorage.removeItem(
                "ecoNivel"
            );

        }

    } catch (erro) {

        console.warn(
            "Não foi possível atualizar os dados locais:",
            erro
        );

    }

}


carregarUsuarioAtual();

// ========================================
//  16.MINHA JORNADA NA PÁGINA INICIAL
// ========================================

const jornadaNome =
    document.getElementById("jornada-nome");

const jornadaXp =
    document.getElementById("jornada-xp");

const jornadaMoedas =
    document.getElementById("jornada-moedas");

const jornadaMensagem =
    document.getElementById("mini-ranking-posicao");


async function carregarMinhaJornada() {

    if (
        !jornadaNome ||
        !jornadaXp ||
        !jornadaMoedas
    ) {
        return;
    }

    try {

        const resposta = await fetch(
            "http://127.0.0.1:3000/api/perfil",
            {
                credentials: "include",
                cache: "no-store"
            }
        );


        // ========================================
        // VISITANTE
        // ========================================

        if (resposta.status === 401) {

            jornadaNome.textContent =
                "Visitante";

            jornadaXp.textContent =
                "0 XP";

            jornadaMoedas.textContent =
                "0";

            if (jornadaMensagem) {

                jornadaMensagem.textContent =
                    "Faça login para acompanhar sua jornada 🌱";

            }

            return;
        }


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar sua jornada."
            );

        }


        // ========================================
        // DADOS DO PERFIL
        // ========================================

        const dados =
            await resposta.json();


        if (!dados.usuario) {

            throw new Error(
                "O perfil não retornou os dados do usuário."
            );

        }


        const usuario =
            dados.usuario;


        const xp =
            Number(usuario.xp) || 0;

        const moedas =
            Number(usuario.moedas) || 0;


        // ========================================
        // ATUALIZA A TELA
        // ========================================

        jornadaNome.textContent =
            usuario.nome || "Sua conta";


        jornadaXp.textContent =
            `${xp.toLocaleString("pt-BR")} XP`;


        jornadaMoedas.textContent =
            moedas.toLocaleString("pt-BR");


        if (jornadaMensagem) {

            jornadaMensagem.textContent =
                "Continue aprendendo e evoluindo 🌱";

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar Minha Jornada:",
            erro
        );


        jornadaNome.textContent =
            "Conta indisponível";

        jornadaXp.textContent =
            "—";

        jornadaMoedas.textContent =
            "—";


        if (jornadaMensagem) {

            jornadaMensagem.textContent =
                "Não foi possível carregar seu progresso.";

        }

    }

}


carregarMinhaJornada();


// ========================================
// 17. LOGOUT
// ========================================

const btnSair =
    document.getElementById("btn-sair");

if (btnSair) {

    btnSair.addEventListener(
        "click",
        async function (evento) {

            evento.preventDefault();

            try {

                const resposta =
                    await fetch(
                        "http://127.0.0.1:3000/api/logout",
                        {
                            method: "POST",
                            credentials: "include"
                        }
                    );

                const dados =
                    await resposta
                        .json()
                        .catch(() => ({}));

                if (!resposta.ok) {

                    alert(
                        dados.mensagem ||
                        "Não foi possível sair."
                    );

                    return;

                }

                localStorage.removeItem(
                    "ecoUsuario"
                );

                localStorage.removeItem(
                    "ecoNivel"
                );

                window.location.href =
                    "index.html";

            } catch (erro) {

                console.error(
                    "Erro ao fazer logout:",
                    erro
                );

                alert(
                    "Não foi possível concluir a saída. Tente novamente."
                );

            }

        }
    );

}