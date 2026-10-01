"use strict";

const API = "http://127.0.0.1:3000/api";

const elemento = id => document.getElementById(id);
const modal = elemento("configuracoes");

let usuario;
let ocupado = false;

function guardarUsuario() {
    try {
        localStorage.setItem("ecoUsuario", JSON.stringify(usuario));
    } catch { } 
}

function limparSessao() {
    try {
        localStorage.removeItem("ecoUsuario");
    } catch { }
}

async function consultar(caminho, opcoes = {}) {
    const controle = new AbortController();
    const limite = setTimeout(() => controle.abort(), 12000);

    try {
        const resposta = await fetch(API + caminho, {
            ...opcoes,
            credentials: "include",
            cache: "no-store",
            signal: controle.signal
        });

        const dados = await resposta.json().catch(() => ({}));

        if (!resposta.ok) {
            const erro = new Error(
                dados.mensagem ||
                "Não foi possível concluir. Tente novamente."
            );

            erro.status = resposta.status;
            throw erro;
        }

        return dados;
    } catch (erro) {
        if (erro.name === "AbortError") {
            throw new Error(
                "O servidor demorou para responder. Tente novamente."
            );
        }

        if (erro instanceof TypeError) {
            throw new Error(
                "Não foi possível conectar ao servidor."
            );
        }

        throw erro;
    } finally {
        clearTimeout(limite);
    }
}

function mostrarIdentidade() {
    const partes = usuario.nome.trim().split(/\s+/);

    const iniciais = (
        partes[0][0] +
        (partes.length > 1 ? partes.at(-1)[0] : "")
    ).toLocaleUpperCase("pt-BR");

    elemento("nome-perfil").textContent = usuario.nome;
    elemento("avatar").textContent = iniciais;

    elemento("tipo-perfil").textContent = ({
        aluno: "Conta de estudante",
        professor: "Conta de professor",
        responsavel: "Conta de responsável"
    })[usuario.tipo] || "Conta EcoEnergia";

    guardarUsuario();
    carregarPreferenciaVisual();
}

function mostrarPerfil(dados) {
    usuario = dados.usuario;

    const trilha = dados.trilha;
    const feitos = trilha.blocosConcluidos;
    const total = trilha.totalBlocos;
    const completo = total > 0 && feitos === total;

    mostrarIdentidade();

    elemento("xp").textContent =
        Number(usuario.xp || 0).toLocaleString("pt-BR");

    elemento("ofensiva").textContent = usuario.sequencia;
    elemento("liga").textContent = usuario.liga || "Bronze";
    elemento("blocos").textContent = feitos + " / " + total;

    elemento("progresso").value = total
        ? Math.round(feitos / total * 100)
        : 0;

    elemento("progresso-texto").textContent =
        "Trilha " + trilha.nome +
        " · " + feitos + " de " + total + " blocos concluídos";

    elemento("continuar").href =
        "trilha.html?" +
        new URLSearchParams({ nivel: trilha.nivel });

    elemento("continuar").textContent = completo
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
            trilha.modulosConcluidos >= 1
        ],
        [
            "🌿",
            "Meia trilha",
            "Conclua " + Math.ceil(total / 2) + " blocos da trilha.",
            total > 0 && feitos >= Math.ceil(total / 2)
        ],
        [
            "🌎",
            "Trilha completa",
            "Conclua todos os " + total + " blocos.",
            completo
        ]
    ];

    elemento("conquistas").replaceChildren();

    for (const [icone, titulo, descricao, liberada] of conquistas) {
        const item = document.createElement("li");

        item.className =
            "cartao conquista" +
            (liberada ? " desbloqueada" : "");

        const partes = [
            ["span", "medalha", liberada ? icone : "🔒"],
            ["strong", "", titulo],
            ["p", "", descricao],
            ["small", "", liberada ? "Conquistada ✓" : "Bloqueada"]
        ];

        for (const [tag, classe, texto] of partes) {
            const parte = document.createElement(tag);

            parte.className = classe;
            parte.textContent = texto;

            if (classe === "medalha") {
                parte.setAttribute("aria-hidden", "true");
            }

            item.append(parte);
        }

        elemento("conquistas").append(item);
    }
}

async function carregarPerfil() {
    elemento("perfil").hidden = true;
    elemento("estado").hidden = false;
    elemento("tentar").hidden = true;
    elemento("entrar").hidden = true;

    elemento("mensagem").textContent = "Carregando seu perfil...";

    try {
        mostrarPerfil(await consultar("/perfil"));

        elemento("estado").hidden = true;
        elemento("perfil").hidden = false;
    } catch (erro) {
        if (erro.status === 401) {
            limparSessao();
        }

        elemento("mensagem").textContent = erro.status === 401
            ? "Entre na sua conta para ver seu perfil."
            : erro.message;

        elemento("entrar").hidden = erro.status !== 401;
        elemento("tentar").hidden = erro.status === 401;
    }
}

function travarFormulario(valor) {
    ocupado = valor;

    for (const id of ["nome", "salvar", "sair", "cancelar", "fechar"]) {
        elemento(id).disabled = valor;
    }
}

function mostrarRetorno(texto, erro = false) {
    elemento("retorno").textContent = texto;
    elemento("retorno").classList.toggle("erro", erro);
}

elemento("configurar").addEventListener("click", () => {
    elemento("nome").value = usuario.nome;
    elemento("email").value = usuario.email;

    mostrarRetorno("");
    modal.showModal();
});

for (const id of ["fechar", "cancelar"]) {
    elemento(id).addEventListener("click", () => modal.close());
}

modal.addEventListener("cancel", evento => {
    if (ocupado) {
        evento.preventDefault();
    }
});

elemento("formulario").addEventListener("submit", async evento => {
    evento.preventDefault();

    if (ocupado) return;

    travarFormulario(true);
    mostrarRetorno("Salvando...");

    try {
        const dados = await consultar("/perfil", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: elemento("nome").value
            })
        });

        usuario.nome = dados.nome;
        mostrarIdentidade();

        elemento("nome").value = dados.nome;
        mostrarRetorno("Alterações salvas!");
    } catch (erro) {
        mostrarRetorno(erro.message, true);

        if (erro.status === 401) {
            modal.close();
            await carregarPerfil();
        }
    } finally {
        travarFormulario(false);
    }
});

elemento("sair").addEventListener("click", async () => {
    if (ocupado) return;

    travarFormulario(true);
    mostrarRetorno("Saindo...");

    try {
        await consultar("/logout", { method: "POST" });

        limparSessao();
        window.location.replace("login.html");
    } catch (erro) {
        if (erro.status === 401) {
            limparSessao();
            window.location.replace("login.html");
        } else {
            mostrarRetorno(erro.message, true);
        }
    } finally {
        travarFormulario(false);
    }
});

elemento("tentar").addEventListener("click", carregarPerfil);

window.addEventListener("pageshow", evento => {
    if (evento.persisted) {
        modal.close();
        carregarPerfil();
    }
});

carregarPerfil();

// Navegação dentro das configurações.
function abrirTelaConfiguracoes(tela, focar = true) {
    if (ocupado) return;

    const titulos = {
        inicio: "Configurações",
        preferencias: "Preferências",
        perfil: "Perfil",
        dados: "Dados da conta",
        ajuda: "Central de ajuda"
    };

    if (!titulos[tela]) return;

    modal.querySelectorAll("[data-cfg-tela]").forEach(secao => {
        secao.hidden = secao.dataset.cfgTela !== tela;
    });

    elemento("configuracoes-titulo").textContent = titulos[tela];
    elemento("cfg-voltar").hidden = tela === "inicio";

    modal.querySelector(".cfg-conteudo").scrollTop = 0;

    mostrarRetorno("");

    if (tela === "perfil") {
        elemento("nome").value = usuario.nome;
        elemento("email").value = usuario.email;
    }

    if (focar) {
        const destino = tela === "perfil"
            ? "nome"
            : "configuracoes-titulo";

        elemento(destino).focus();
    }
}

function aplicarTemaPerfil(escuro) {
    document.documentElement.classList.toggle(
        "perfil-escuro",
        escuro
    );

    elemento("cfg-escuro").checked = escuro;
}

function carregarPreferenciaVisual() {
    let escuro = false;

    try {
        escuro = localStorage.getItem(
            "ecoTemaPerfil:" + usuario.id
        ) === "escuro";
    } catch { }

    aplicarTemaPerfil(escuro);
}

// Abre a opção escolhida no menu.
modal.querySelectorAll("[data-cfg-abrir]").forEach(botao => {
    botao.addEventListener("click", () => {
        abrirTelaConfiguracoes(botao.dataset.cfgAbrir);
    });
});

// Retorna ao menu principal.
elemento("cfg-voltar").addEventListener("click", () => {
    abrirTelaConfiguracoes("inicio");
});

// Complementa o evento que já abre as configurações.
elemento("configurar").addEventListener("click", () => {
    abrirTelaConfiguracoes("inicio");
});

// Prepara o menu para a próxima abertura.
modal.addEventListener("close", () => {
    abrirTelaConfiguracoes("inicio", false);
});

// Evita mudar de tela enquanto uma operação está em andamento.
modal.addEventListener("click", evento => {
    const navegacao = evento.target.closest(
        "[data-cfg-abrir], #cfg-voltar, #cfg-escuro, a"
    );

    if (ocupado && navegacao) {
        evento.preventDefault();
        evento.stopImmediatePropagation();
    }
}, true);

// Mantém a rolagem dentro das configurações.
elemento("configurar").addEventListener("click", () => {
    document.body.classList.add("cfg-aberta");
});

modal.addEventListener("close", () => {
    document.body.classList.remove("cfg-aberta");
});

// Salva a preferência visual separadamente para cada conta.
elemento("cfg-escuro").addEventListener("change", evento => {
    const escuro = evento.target.checked;

    aplicarTemaPerfil(escuro);

    try {
        localStorage.setItem(
            "ecoTemaPerfil:" + usuario.id,
            escuro ? "escuro" : "claro"
        );

        mostrarRetorno("Preferência salva neste navegador.");
    } catch {
        mostrarRetorno(
            "Tema aplicado. O navegador não permitiu salvar a preferência.",
            true
        );
    }
});