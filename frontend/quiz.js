"use strict";

(() => {
    const parametrosBloco = new URLSearchParams(window.location.search);
    const atividadeBloco = parametrosBloco.get("atividadeId");

    if (atividadeBloco) {
        iniciarBlocoDaTrilha(
            parametrosBloco.get("nivel") || "facil",
            atividadeBloco
        );

        return;
    }

    // ========================================
    // QUIZ DOS BLOCOS DA TRILHA
    // ========================================

    async function iniciarBlocoDaTrilha(nivel, atividadeId) {
        const API = "/api";

        const el = id => document.getElementById(id);

        const area = el("quiz-area");
        const resultado = el("quiz-resultado");
        const proxima = el("btn-proxima-quiz");
        const refazer = el("btn-refazer-quiz");

        let bloco;
        let indice = 0;
        let respostas = [];
        let enviando = false;

        const retorno =
            "trilha.html?" + new URLSearchParams({ nivel });

        function texto(id, valor) {
            if (el(id)) {
                el(id).textContent = valor;
            }
        }

        function elemento(tag, classe, conteudo) {
            const item = document.createElement(tag);
            item.className = classe;

            if (conteudo !== undefined) {
                item.textContent = conteudo;
            }

            return item;
        }

        async function consultar(caminho, opcoes = {}) {
            const controle = new AbortController();

            const limite = setTimeout(
                () => controle.abort(),
                15000
            );

            try {
                const resposta = await fetch(API + caminho, {
                    cache: "no-store",
                    credentials: "include",
                    ...opcoes,
                    signal: controle.signal
                });

                const dados = await resposta.json();

                if (!resposta.ok) {
                    const erro = new Error(
                        resposta.status === 401
                            ? "Sua sessão terminou. Faça login e volte à trilha."
                            : dados.mensagem ||
                            "Não foi possível concluir a solicitação."
                    );

                    erro.status = resposta.status;

                    throw erro;
                }

                return dados;
            } finally {
                clearTimeout(limite);
            }
        }

        // Navegação e mensagens da trilha.

        document.body.classList.add("quiz-em-trilha");

        const navegacao = elemento(
            "div",
            "trilha-quiz-barra"
        );

        const voltar = elemento(
            "a",
            "trilha-quiz-botao",
            "← Voltar à trilha"
        );

        voltar.href = retorno;

        const aviso = elemento(
            "p",
            "trilha-quiz-aviso",
            "Carregando as perguntas..."
        );

        aviso.setAttribute("role", "status");
        aviso.setAttribute("aria-live", "polite");

        const tentar = elemento(
            "button",
            "trilha-quiz-botao",
            "Tentar novamente"
        );

        tentar.type = "button";
        tentar.hidden = true;

        // Todos os controles ficam dentro de uma única barra.
        navegacao.append(voltar, aviso, tentar);

        // A barra aparece acima do card.
        area.before(navegacao);

        const revisao = elemento(
            "div",
            "trilha-quiz-revisao"
        );

        resultado.append(revisao);

        const continuar = elemento(
            "a",
            "trilha-quiz-botao trilha-quiz-continuar",
            "Próximo bloco →"
        );

        continuar.hidden = true;

        resultado.append(continuar);

        function mostrarPergunta() {
            const pergunta = bloco.perguntas[indice];

            texto(
                "quiz-contador",
                `Pergunta ${indice + 1} de ${bloco.perguntas.length}`
            );

            texto(
                "quiz-categoria",
                pergunta.categoria || pergunta.tema || "Energia"
            );

            texto("quiz-pergunta", pergunta.pergunta);
            texto("quiz-xp", "XP ao finalizar");

            el("quiz-progresso").style.width =
                `${indice / bloco.perguntas.length * 100}%`;

            el("quiz-feedback").classList.add("escondido");

            proxima.disabled = true;

            proxima.textContent =
                indice === bloco.perguntas.length - 1
                    ? "Concluir bloco →"
                    : "Próxima pergunta →";

            const alternativas = el("quiz-alternativas");

            alternativas.replaceChildren();

            pergunta.alternativas.forEach((alternativa, posicao) => {
                const botao = elemento(
                    "button",
                    "quiz-alternativa"
                );

                botao.type = "button";
                botao.setAttribute("aria-pressed", "false");

                botao.append(
                    elemento(
                        "span",
                        "quiz-alternativa-letra",
                        String.fromCharCode(65 + posicao)
                    ),
                    elemento(
                        "span",
                        "quiz-alternativa-texto",
                        alternativa
                    )
                );

                botao.addEventListener("click", () => {
                    if (enviando) return;

                    respostas[indice] = posicao;

                    alternativas.querySelectorAll("button").forEach(outro => {
                        outro.setAttribute(
                            "aria-pressed",
                            String(outro === botao)
                        );

                        outro.style.outline =
                            outro === botao
                                ? "3px solid var(--azul-escuro, #17384b)"
                                : "";
                    });

                    proxima.disabled = false;

                    el("quiz-feedback").classList.remove("escondido");

                    texto("quiz-feedback-icone", "📝");
                    texto("quiz-feedback-titulo", "Resposta selecionada");

                    texto(
                        "quiz-feedback-texto",
                        "A correção aparece ao finalizar o bloco."
                    );
                });

                alternativas.append(botao);
            });
        }

        function reiniciar() {
            indice = 0;
            respostas = [];

            revisao.replaceChildren();
            continuar.hidden = true;

            aviso.textContent = "Escolha uma alternativa e avance.";

            resultado.classList.add("escondido");
            area.classList.remove("escondido");

            mostrarPergunta();
        }

        async function carregar() {
            area.classList.add("escondido");
            resultado.classList.add("escondido");

            tentar.hidden = true;

            aviso.textContent = "Carregando as perguntas...";

            try {
                const base =
                    "/trilhas/" + encodeURIComponent(nivel);

                const progresso = await consultar(
                    base + "/progresso"
                );

                const status = progresso.blocos.find(
                    item => item.atividadeId === atividadeId
                );

                if (!status?.liberado) {
                    throw new Error(
                        "Conclua os blocos anteriores para abrir este bloco."
                    );
                }

                bloco = await consultar(
                    base +
                    "/blocos/" +
                    encodeURIComponent(atividadeId)
                );

                if (
                    !Array.isArray(bloco.perguntas) ||
                    !bloco.perguntas.length ||
                    bloco.atividadeId !== atividadeId
                ) {
                    throw new Error("O bloco recebido é inválido.");
                }

                texto("quiz-nivel-tag", "TRILHA · " + nivel.toUpperCase());
                texto("quiz-nivel-nome", bloco.nome);

                texto(
                    "quiz-resultado-nivel",
                    bloco.moduloNome + " · " + bloco.nome
                );

                document.title = bloco.nome + " | EcoEnergia";

                reiniciar();
            } catch (erro) {
                aviso.textContent =
                    erro.name === "AbortError"
                        ? "O servidor demorou para responder."
                        : erro.message;

                tentar.hidden = false;

                if (erro.status === 401) {
                    const login = elemento(
                        "a",
                        "btn-dificuldade",
                        "Fazer login"
                    );

                    login.href = "login.html";

                    aviso.append(
                        document.createTextNode(" "),
                        login
                    );
                }
            }
        }

        async function concluir() {
            if (enviando) return;

            const completas =
                respostas.length === bloco.perguntas.length &&
                bloco.perguntas.every((pergunta, posicao) =>
                    Number.isInteger(respostas[posicao]) &&
                    respostas[posicao] >= 0 &&
                    respostas[posicao] < pergunta.alternativas.length
                );

            if (!completas) {
                aviso.textContent =
                    "Responda todas as perguntas antes de concluir.";

                return;
            }

            enviando = true;

            proxima.disabled = true;
            refazer.disabled = true;
            continuar.hidden = true;

            aviso.textContent = "Corrigindo suas respostas...";

            try {
                const dados = await consultar(
                    "/atividade/concluir",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            atividadeId: bloco.atividadeId,
                            respostas
                        })
                    }
                );

                if (typeof dados.aprovado !== "boolean") {
                    throw new Error(
                        "O servidor está com a versão antiga. Reinicie o backend e tente novamente."
                    );
                }

                try {
                    if (dados.usuario) {
                        localStorage.setItem(
                            "ecoUsuario",
                            JSON.stringify(dados.usuario)
                        );
                    }
                } catch (erro) {
                    console.warn(
                        "Não foi possível atualizar o cache:",
                        erro
                    );
                }

                area.classList.add("escondido");
                resultado.classList.remove("escondido");

                el("quiz-progresso").style.width = "100%";

                texto(
                    "quiz-total-acertos",
                    dados.acertos
                );

                texto(
                    "quiz-total-erros",
                    dados.totalPerguntas - dados.acertos
                );

                texto(
                    "quiz-xp-ganho",
                    `+${dados.xpGanho} XP`
                );

                texto(
                    "quiz-resultado-emoji",
                    dados.aprovado ? "🏆" : "💡"
                );

                texto(
                    "quiz-mensagem-titulo",
                    dados.aprovado
                        ? "Bloco aprovado!"
                        : dados.concluido
                            ? "Revisão finalizada"
                            : "Vamos tentar novamente?"
                );

                texto(
                    "quiz-mensagem-texto",
                    dados.mensagem
                );

                aviso.textContent =
                    `${dados.acertos} acertos · ` +
                    `${dados.totalPerguntas - dados.acertos} erros · ` +
                    `+${dados.xpGanho} XP`;

                refazer.textContent = dados.concluido
                    ? "Revisar bloco"
                    : "Tentar novamente";

                if (dados.aprovado) {
                    revisao.replaceChildren(
                        elemento(
                            "h3",
                            "",
                            "Confira as respostas que você acertou"
                        )
                    );
                } else {
                    revisao.replaceChildren();
                }

                const porId = new Map(
                    bloco.perguntas.map(pergunta => [
                        pergunta.id,
                        pergunta
                    ])
                );

                (dados.resultados || []).forEach((correcao, posicao) => {

                    if (!dados.aprovado || !correcao.acertou) {
                        return;
                    }

                    const pergunta = porId.get(
                        correcao.perguntaId
                    );

                    if (!pergunta) return;

                    const item = elemento("section", "");

                    item.append(
                        elemento(
                            "h4",
                            "",
                            `${correcao.acertou ? "✅ Acertou" : "❌ Errou"} — ${posicao + 1}. ${pergunta.pergunta}`
                        ),
                        elemento(
                            "p",
                            "",
                            "Sua resposta: " +
                            pergunta.alternativas[
                            correcao.respostaEscolhida
                            ]
                        ),
                        elemento(
                            "p",
                            "",
                            "Resposta correta: " +
                            pergunta.alternativas[
                            correcao.respostaCorreta
                            ]
                        ),
                        elemento(
                            "p",
                            "",
                            correcao.explicacao || ""
                        )
                    );

                    revisao.append(item);
                });

                if (
                    dados.concluido &&
                    dados.proximaAtividadeId
                ) {
                    continuar.href =
                        "quiz.html?" +
                        new URLSearchParams({
                            nivel,
                            atividadeId: dados.proximaAtividadeId
                        });

                    continuar.hidden = false;
                }

                resultado.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            } catch (erro) {
                console.error("Falha ao concluir o bloco:", {
                    status: erro.status,
                    mensagem: erro.message,
                    atividadeId: bloco.atividadeId,
                    quantidadeRespostas: respostas.length
                });

                aviso.textContent =
                    erro.name === "AbortError"
                        ? "O servidor demorou. Suas respostas foram mantidas; tente salvar novamente."
                        : erro.message;

                proxima.textContent = "Tentar salvar novamente →";
            } finally {
                enviando = false;

                proxima.disabled = false;
                refazer.disabled = false;
            }
        }

        proxima.addEventListener("click", () => {
            if (
                enviando ||
                !Number.isInteger(respostas[indice])
            ) {
                return;
            }

            if (indice < bloco.perguntas.length - 1) {
                indice++;
                mostrarPergunta();
            } else {
                concluir();
            }
        });

        refazer.addEventListener("click", () => {
            if (!enviando) {
                reiniciar();
            }
        });

        tentar.addEventListener("click", carregar);

        await carregar();
    }

    // ========================================
    // QUIZZES ANTIGOS — CONFIGURAÇÃO
    // ========================================

    const niveisQuiz = {
        facil: {
            nome: "Fácil",
            emoji: "🌱",
            atividadeId: "quiz_facil_01",
            xpPorAcerto: 10,
            perguntas: [
                {
                    categoria: "💧 ECONOMIA DE ÁGUA",
                    pergunta: "Qual atitude ajuda mais a economizar água durante o banho?",
                    alternativas: [
                        "Deixar o chuveiro ligado enquanto se ensaboa",
                        "Fechar o chuveiro enquanto se ensaboa",
                        "Tomar dois banhos seguidos",
                        "Aumentar a pressão da água"
                    ],
                    correta: 1,
                    explicacao: "Fechar o chuveiro enquanto se ensaboa evita desperdício de água."
                },
                {
                    categoria: "⚡ ECONOMIA DE ENERGIA",
                    pergunta: "Qual atitude ajuda a reduzir o consumo de energia em casa?",
                    alternativas: [
                        "Deixar todas as luzes acesas",
                        "Abrir a geladeira várias vezes",
                        "Apagar as luzes de ambientes vazios",
                        "Deixar a televisão ligada sem ninguém assistir"
                    ],
                    correta: 2,
                    explicacao: "Apagar as luzes quando ninguém está no ambiente ajuda a reduzir o consumo de energia."
                },
                {
                    categoria: "💧 USO CONSCIENTE DA ÁGUA",
                    pergunta: "Ao escovar os dentes, qual é a atitude mais sustentável?",
                    alternativas: [
                        "Deixar a torneira aberta o tempo todo",
                        "Abrir a torneira apenas quando precisar",
                        "Usar água quente durante toda a escovação",
                        "Escovar os dentes com o chuveiro ligado"
                    ],
                    correta: 1,
                    explicacao: "Abrir a torneira apenas quando necessário reduz bastante o desperdício de água."
                },
                {
                    categoria: "⚡ ENERGIA",
                    pergunta: "Qual aparelho pode continuar consumindo energia quando fica em modo de espera?",
                    alternativas: [
                        "Televisão",
                        "Cadeira",
                        "Copo",
                        "Livro"
                    ],
                    correta: 0,
                    explicacao: "Aparelhos eletrônicos podem consumir uma pequena quantidade de energia mesmo em modo de espera."
                },
                {
                    categoria: "🌱 SUSTENTABILIDADE",
                    pergunta: "Qual destas atitudes ajuda o meio ambiente?",
                    alternativas: [
                        "Desperdiçar água",
                        "Jogar lixo no chão",
                        "Reutilizar materiais sempre que possível",
                        "Deixar equipamentos ligados sem necessidade"
                    ],
                    correta: 2,
                    explicacao: "Reutilizar materiais reduz desperdícios e a necessidade de consumir novos recursos."
                },
                {
                    categoria: "💧 ECONOMIA DE ÁGUA",
                    pergunta: "Qual é uma boa maneira de economizar água ao lavar o carro?",
                    alternativas: [
                        "Usar uma mangueira ligada continuamente",
                        "Usar balde e pano",
                        "Deixar a água escorrer pela rua",
                        "Lavar o carro todos os dias"
                    ],
                    correta: 1,
                    explicacao: "Usar balde e pano normalmente utiliza menos água do que deixar uma mangueira aberta continuamente."
                },
                {
                    categoria: "⚡ CONSUMO CONSCIENTE",
                    pergunta: "Ao sair de um quarto vazio, o ideal é:",
                    alternativas: [
                        "Deixar a luz acesa",
                        "Ligar mais aparelhos",
                        "Apagar a luz",
                        "Abrir a geladeira"
                    ],
                    correta: 2,
                    explicacao: "Apagar a luz quando o ambiente não está sendo utilizado evita consumo desnecessário."
                },
                {
                    categoria: "🌎 MEIO AMBIENTE",
                    pergunta: "Por que economizar água potável é importante?",
                    alternativas: [
                        "Porque a água adequada para consumo precisa ser preservada",
                        "Porque toda a água do planeta pode ser consumida diretamente",
                        "Porque nunca existe falta de água",
                        "Porque água não é usada na produção de alimentos"
                    ],
                    correta: 0,
                    explicacao: "A água própria para consumo humano é um recurso que precisa ser utilizado de forma consciente."
                },
                {
                    categoria: "⚡ ILUMINAÇÃO",
                    pergunta: "Qual alternativa ajuda a aproveitar melhor a iluminação durante o dia?",
                    alternativas: [
                        "Fechar todas as cortinas",
                        "Acender todas as lâmpadas",
                        "Aproveitar a luz natural",
                        "Usar várias luminárias ao mesmo tempo"
                    ],
                    correta: 2,
                    explicacao: "Aproveitar a luz natural reduz a necessidade de utilizar iluminação elétrica durante o dia."
                },
                {
                    categoria: "🌱 ECOENERGIA",
                    pergunta: "Qual destas opções representa um hábito sustentável?",
                    alternativas: [
                        "Desperdiçar recursos",
                        "Consumir água e energia sem necessidade",
                        "Usar os recursos naturais de forma consciente",
                        "Manter aparelhos ligados o dia inteiro"
                    ],
                    correta: 2,
                    explicacao: "Usar água, energia e outros recursos de maneira consciente é um hábito sustentável."
                }
            ]
        },

        medio: {
            nome: "Médio",
            emoji: "💧",
            atividadeId: "quiz_medio_01",
            xpPorAcerto: 10,
            perguntas: [
                {
                    categoria: "💧 CONSUMO DE ÁGUA",
                    pergunta: "Uma torneira está pingando sem necessidade. Qual é a atitude mais adequada?",
                    alternativas: [
                        "Ignorar porque gotas não fazem diferença",
                        "Aumentar a pressão da torneira",
                        "Providenciar o reparo do vazamento",
                        "Deixar um recipiente transbordando embaixo"
                    ],
                    correta: 2,
                    explicacao: "Corrigir vazamentos evita perdas contínuas de água."
                },
                {
                    categoria: "⚡ EFICIÊNCIA ENERGÉTICA",
                    pergunta: "Por que lâmpadas LED costumam ser uma opção eficiente para iluminação?",
                    alternativas: [
                        "Porque precisam ficar ligadas por mais tempo",
                        "Porque produzem a mesma luz usando sempre mais potência",
                        "Porque podem fornecer iluminação com menor consumo de energia",
                        "Porque só funcionam durante o dia"
                    ],
                    correta: 2,
                    explicacao: "Lâmpadas LED podem fornecer iluminação utilizando menos energia que tecnologias menos eficientes."
                },
                {
                    categoria: "💧 REÚSO",
                    pergunta: "Qual uso é mais adequado para água de chuva coletada sem tratamento para consumo?",
                    alternativas: [
                        "Beber diretamente",
                        "Cozinhar alimentos",
                        "Regar jardins, quando adequado",
                        "Preparar mamadeiras"
                    ],
                    correta: 2,
                    explicacao: "Água de chuva sem tratamento potável pode ser destinada a usos não potáveis, como irrigação."
                },
                {
                    categoria: "⚡ ELETRODOMÉSTICOS",
                    pergunta: "Qual prática ajuda a evitar consumo desnecessário de energia?",
                    alternativas: [
                        "Manter todos os aparelhos em espera permanentemente",
                        "Desligar equipamentos que não precisam permanecer energizados",
                        "Aumentar o brilho das telas ao máximo",
                        "Ligar vários aparelhos sem necessidade"
                    ],
                    correta: 1,
                    explicacao: "Desligar equipamentos que não precisam permanecer energizados reduz consumos desnecessários."
                },
                {
                    categoria: "🌱 RESÍDUOS",
                    pergunta: "Qual ação contribui para reduzir a geração de resíduos?",
                    alternativas: [
                        "Comprar itens descartáveis sempre que possível",
                        "Reutilizar produtos e evitar compras desnecessárias",
                        "Misturar recicláveis com rejeitos",
                        "Trocar produtos funcionais sem necessidade"
                    ],
                    correta: 1,
                    explicacao: "Reutilizar produtos e consumir de maneira consciente reduz a quantidade de resíduos."
                },
                {
                    categoria: "💧 IRRIGAÇÃO",
                    pergunta: "Para reduzir perdas de água na irrigação de um jardim, qual prática costuma ser melhor?",
                    alternativas: [
                        "Irrigar em horários de menor evaporação",
                        "Irrigar sempre ao meio-dia",
                        "Molhar a calçada junto com as plantas",
                        "Usar mais água do que o solo consegue absorver"
                    ],
                    correta: 0,
                    explicacao: "Horários de menor evaporação ajudam a diminuir a perda de água para a atmosfera."
                },
                {
                    categoria: "⚡ CLIMATIZAÇÃO",
                    pergunta: "Com o ar-condicionado ligado, qual atitude ajuda a evitar desperdício de energia?",
                    alternativas: [
                        "Manter portas e janelas abertas",
                        "Usar temperatura adequada e manter o ambiente fechado",
                        "Cobrir a saída de ar",
                        "Ligar equipamentos que geram calor sem necessidade"
                    ],
                    correta: 1,
                    explicacao: "Manter o ambiente fechado reduz o trabalho desnecessário do sistema de climatização."
                },
                {
                    categoria: "🌎 CONSUMO CONSCIENTE",
                    pergunta: "Antes de comprar um produto novo, qual pergunta representa melhor o consumo consciente?",
                    alternativas: [
                        "Eu realmente preciso disso?",
                        "Como posso gerar mais lixo?",
                        "Posso trocar mesmo que o atual esteja funcionando?",
                        "Como posso gastar mais recursos?"
                    ],
                    correta: 0,
                    explicacao: "Avaliar a necessidade real da compra ajuda a evitar consumo e descarte desnecessários."
                },
                {
                    categoria: "⚡ ENERGIA RENOVÁVEL",
                    pergunta: "Qual tecnologia converte diretamente parte da radiação solar em eletricidade?",
                    alternativas: [
                        "Módulos fotovoltaicos",
                        "Motor a diesel",
                        "Caldeira a carvão",
                        "Gerador a gasolina"
                    ],
                    correta: 0,
                    explicacao: "Módulos fotovoltaicos convertem parte da radiação solar em energia elétrica."
                },
                {
                    categoria: "💧 SANEAMENTO",
                    pergunta: "Por que não é recomendado jogar óleo de cozinha diretamente na pia?",
                    alternativas: [
                        "Porque melhora o tratamento de esgoto",
                        "Porque pode causar problemas nas tubulações e no sistema de esgoto",
                        "Porque transforma água em água potável",
                        "Porque elimina resíduos"
                    ],
                    correta: 1,
                    explicacao: "O descarte inadequado de óleo pode provocar obstruções e dificultar processos de coleta e tratamento."
                }
            ]
        },

        dificil: {
            nome: "Difícil",
            emoji: "⚡",
            atividadeId: "quiz_dificil_01",
            xpPorAcerto: 10,
            perguntas: [
                {
                    categoria: "⚡ POTÊNCIA E ENERGIA",
                    pergunta: "Um aparelho de 1000 W funciona por 2 horas. Qual energia ele consome?",
                    alternativas: [
                        "0,5 kWh",
                        "1 kWh",
                        "2 kWh",
                        "2000 kWh"
                    ],
                    correta: 2,
                    explicacao: "1000 W = 1 kW. Portanto, 1 kW × 2 h = 2 kWh."
                },
                {
                    categoria: "💧 VAZÃO",
                    pergunta: "Uma torneira fornece 8 litros por minuto durante 5 minutos. Qual volume foi utilizado?",
                    alternativas: [
                        "13 L",
                        "25 L",
                        "40 L",
                        "80 L"
                    ],
                    correta: 2,
                    explicacao: "Volume = vazão × tempo = 8 × 5 = 40 litros."
                },
                {
                    categoria: "⚡ EFICIÊNCIA",
                    pergunta: "Dois equipamentos realizam a mesma tarefa. Um consome 500 Wh e outro 350 Wh. Qual utiliza menos energia?",
                    alternativas: [
                        "O de 500 Wh",
                        "O de 350 Wh",
                        "Os dois consomem exatamente igual",
                        "Não existe relação com energia"
                    ],
                    correta: 1,
                    explicacao: "Para a mesma tarefa, o equipamento de 350 Wh utiliza menos energia."
                },
                {
                    categoria: "🌞 SOLAR FOTOVOLTAICA",
                    pergunta: "Qual situação tende a reduzir a geração de um sistema fotovoltaico?",
                    alternativas: [
                        "Boa incidência solar",
                        "Sombreamento parcial dos módulos",
                        "Limpeza adequada",
                        "Ausência de obstáculos"
                    ],
                    correta: 1,
                    explicacao: "Sombreamento reduz a radiação que chega às células fotovoltaicas."
                },
                {
                    categoria: "💧 PERDAS DE ÁGUA",
                    pergunta: "Qual situação representa uma perda física de água em uma rede?",
                    alternativas: [
                        "Vazamento em uma tubulação",
                        "Leitura correta do hidrômetro",
                        "Pagamento da conta",
                        "Atualização cadastral"
                    ],
                    correta: 0,
                    explicacao: "Vazamentos provocam perda real de água antes que ela chegue ao ponto de consumo."
                },
                {
                    categoria: "⚡ DEMANDA ELÉTRICA",
                    pergunta: "Se vários equipamentos de alta potência são ligados ao mesmo tempo, o que tende a acontecer com a demanda instantânea?",
                    alternativas: [
                        "Aumenta",
                        "Sempre zera",
                        "Sempre diminui",
                        "Não depende dos equipamentos"
                    ],
                    correta: 0,
                    explicacao: "Cargas funcionando simultaneamente aumentam a potência requerida naquele instante."
                },
                {
                    categoria: "🌱 CICLO DE VIDA",
                    pergunta: "Uma avaliação de ciclo de vida busca considerar impactos ambientais em quais etapas?",
                    alternativas: [
                        "Somente na compra",
                        "Somente no descarte",
                        "Nas etapas relevantes desde matérias-primas até o fim de vida",
                        "Somente na propaganda"
                    ],
                    correta: 2,
                    explicacao: "A abordagem considera diferentes etapas do produto, inclusive obtenção de matérias-primas e fim de vida."
                },
                {
                    categoria: "💧 TRATAMENTO DE ÁGUA",
                    pergunta: "Qual é a principal finalidade da desinfecção no tratamento de água?",
                    alternativas: [
                        "Adicionar areia",
                        "Inativar microrganismos patogênicos",
                        "Adicionar resíduos",
                        "Aumentar o consumo"
                    ],
                    correta: 1,
                    explicacao: "A desinfecção reduz riscos microbiológicos ao inativar microrganismos capazes de causar doenças."
                },
                {
                    categoria: "⚡ FATOR DE POTÊNCIA",
                    pergunta: "Para a mesma potência ativa e tensão, um fator de potência menor pode provocar:",
                    alternativas: [
                        "Menor corrente em qualquer situação",
                        "Maior corrente elétrica",
                        "Menor consumo de água",
                        "Eliminação das perdas"
                    ],
                    correta: 1,
                    explicacao: "Um fator de potência menor pode exigir maior corrente para fornecer a mesma potência ativa."
                },
                {
                    categoria: "🌎 EMISSÕES",
                    pergunta: "Por que reduzir o consumo elétrico pode diminuir emissões associadas à geração?",
                    alternativas: [
                        "Porque toda eletricidade é produzida sem impactos",
                        "Porque pode reduzir a necessidade de geração por fontes emissoras",
                        "Porque eletricidade não depende de fontes",
                        "Porque emissões existem apenas em casas"
                    ],
                    correta: 1,
                    explicacao: "Menor demanda pode evitar parte da geração proveniente de fontes que emitem gases de efeito estufa."
                }
            ]
        },

        impossivel: {
            nome: "Impossível",
            emoji: "🔥",
            atividadeId: "quiz_impossivel_01",
            xpPorAcerto: 10,
            perguntas: [
                {
                    categoria: "⚡ ENERGIA ELÉTRICA",
                    pergunta: "Um equipamento de 1500 W opera durante 40 minutos. Qual é o consumo aproximado?",
                    alternativas: [
                        "0,4 kWh",
                        "0,75 kWh",
                        "1,0 kWh",
                        "1,5 kWh"
                    ],
                    correta: 2,
                    explicacao: "1500 W = 1,5 kW e 40 minutos = 2/3 h. Portanto, 1,5 × 2/3 = 1 kWh."
                },
                {
                    categoria: "💧 VOLUME E VAZÃO",
                    pergunta: "Uma caixa recebe água a 18 L/min durante 25 minutos. Qual volume entra na caixa?",
                    alternativas: [
                        "360 L",
                        "400 L",
                        "450 L",
                        "540 L"
                    ],
                    correta: 2,
                    explicacao: "18 × 25 = 450 litros."
                },
                {
                    categoria: "⚡ EFICIÊNCIA ENERGÉTICA",
                    pergunta: "Uma máquina recebe 2,0 kW e entrega 1,5 kW de potência útil. Qual é sua eficiência?",
                    alternativas: [
                        "25%",
                        "50%",
                        "75%",
                        "133%"
                    ],
                    correta: 2,
                    explicacao: "Eficiência = 1,5 / 2,0 = 0,75 = 75%."
                },
                {
                    categoria: "🌞 GERAÇÃO SOLAR",
                    pergunta: "Um sistema ideal de 2 kW recebe 4 horas equivalentes de sol pleno. Desconsiderando perdas, quanto produz?",
                    alternativas: [
                        "2 kWh",
                        "4 kWh",
                        "6 kWh",
                        "8 kWh"
                    ],
                    correta: 3,
                    explicacao: "Energia = potência × tempo = 2 × 4 = 8 kWh."
                },
                {
                    categoria: "💧 PRESSÃO",
                    pergunta: "Por que controlar pressões excessivas pode ajudar a reduzir perdas em redes de água?",
                    alternativas: [
                        "Porque pressão maior elimina vazamentos",
                        "Porque pressões excessivas podem aumentar vazões de vazamentos",
                        "Porque pressão não influencia sistemas hidráulicos",
                        "Porque transforma água em eletricidade"
                    ],
                    correta: 1,
                    explicacao: "Pressões maiores podem aumentar a vazão em vazamentos existentes e esforços sobre a rede."
                },
                {
                    categoria: "⚡ PONTA DE DEMANDA",
                    pergunta: "Deslocar determinadas cargas para horários diferentes pode ajudar principalmente a:",
                    alternativas: [
                        "Aumentar todas as cargas simultaneamente",
                        "Reduzir picos de demanda",
                        "Eliminar qualquer necessidade de energia",
                        "Impedir energias renováveis"
                    ],
                    correta: 1,
                    explicacao: "Distribuir cargas ao longo do tempo reduz a concentração de potência requerida nos horários de pico."
                },
                {
                    categoria: "🌱 ECONOMIA CIRCULAR",
                    pergunta: "Qual prática está mais alinhada ao prolongamento da vida útil de produtos?",
                    alternativas: [
                        "Descartar no primeiro defeito reparável",
                        "Reparar e reutilizar quando possível",
                        "Trocar produtos funcionais frequentemente",
                        "Dificultar a reciclagem"
                    ],
                    correta: 1,
                    explicacao: "Reparo e reutilização mantêm produtos em uso por mais tempo."
                },
                {
                    categoria: "💧 PEGADA HÍDRICA",
                    pergunta: "O conceito de pegada hídrica de um produto considera principalmente:",
                    alternativas: [
                        "Somente a água visível no produto final",
                        "O uso de água associado às etapas relevantes de sua cadeia de produção",
                        "Somente a água usada na embalagem",
                        "Somente a chuva no dia da compra"
                    ],
                    correta: 1,
                    explicacao: "A pegada hídrica considera água usada direta e indiretamente nas etapas da produção."
                },
                {
                    categoria: "⚡ PERDAS ELÉTRICAS",
                    pergunta: "Mantendo a resistência constante, se a corrente dobra, como varia a perda proporcional a I²R?",
                    alternativas: [
                        "Cai pela metade",
                        "Permanece igual",
                        "Dobra",
                        "Quadruplica"
                    ],
                    correta: 3,
                    explicacao: "Se a corrente dobra, seu quadrado aumenta quatro vezes."
                },
                {
                    categoria: "🌎 GESTÃO DE RECURSOS",
                    pergunta: "Qual indicador ajuda mais a comparar dois processos que produzem exatamente a mesma quantidade útil?",
                    alternativas: [
                        "Energia ou recurso consumido por unidade produzida",
                        "Cor das máquinas",
                        "Número de propagandas",
                        "Tamanho do logotipo"
                    ],
                    correta: 0,
                    explicacao: "O consumo por unidade produzida permite comparar diretamente a eficiência no uso de recursos."
                }
            ]
        },

        tecnico: {
            nome: "Nível Técnico",
            emoji: "🎓",
            atividadeId: "quiz_tecnico_01",
            xpPorAcerto: 10,
            perguntas: [
                {
                    categoria: "🎓 ENERGIA ELÉTRICA",
                    pergunta: "Uma carga de 2 kW permanece ligada durante 3 horas. Qual é a energia consumida?",
                    alternativas: [
                        "0,67 kWh",
                        "5 kWh",
                        "6 kWh",
                        "600 kWh"
                    ],
                    correta: 2,
                    explicacao: "Energia = potência × tempo = 2 kW × 3 h = 6 kWh."
                },
                {
                    categoria: "🎓 POTÊNCIA ELÉTRICA",
                    pergunta: "Em um circuito resistivo ideal de 220 V com corrente de 10 A, qual é a potência?",
                    alternativas: [
                        "22 W",
                        "220 W",
                        "2,2 kW",
                        "22 kW"
                    ],
                    correta: 2,
                    explicacao: "P = V × I = 220 × 10 = 2200 W = 2,2 kW."
                },
                {
                    categoria: "🎓 HIDRÁULICA",
                    pergunta: "Uma bomba fornece 12 L/min durante 5 minutos. Qual volume foi bombeado?",
                    alternativas: [
                        "17 L",
                        "50 L",
                        "60 L",
                        "120 L"
                    ],
                    correta: 2,
                    explicacao: "Volume = vazão × tempo = 12 × 5 = 60 litros."
                },
                {
                    categoria: "🎓 EFICIÊNCIA",
                    pergunta: "Um equipamento recebe 1000 W e entrega 800 W de potência útil. Qual é sua eficiência?",
                    alternativas: [
                        "20%",
                        "80%",
                        "100%",
                        "125%"
                    ],
                    correta: 1,
                    explicacao: "Eficiência = 800 / 1000 = 0,8 = 80%."
                },
                {
                    categoria: "🎓 SISTEMA FOTOVOLTAICO",
                    pergunta: "Um módulo de 400 W recebe 5 horas equivalentes de sol pleno. Desconsiderando perdas, qual energia produz?",
                    alternativas: [
                        "0,4 kWh",
                        "1,0 kWh",
                        "2,0 kWh",
                        "5,0 kWh"
                    ],
                    correta: 2,
                    explicacao: "400 W = 0,4 kW. Assim, 0,4 × 5 = 2 kWh."
                },
                {
                    categoria: "🎓 BOMBAS CENTRÍFUGAS",
                    pergunta: "Pelas leis de afinidade, se a rotação de uma bomba cai para 80%, aproximadamente qual fração da potência original é necessária?",
                    alternativas: [
                        "0,80",
                        "0,64",
                        "0,512",
                        "0,20"
                    ],
                    correta: 2,
                    explicacao: "A potência varia aproximadamente com o cubo da rotação: 0,8³ = 0,512."
                },
                {
                    categoria: "🎓 SISTEMA TRIFÁSICO",
                    pergunta: "Uma carga trifásica equilibrada consome 15 kW, possui fator de potência 0,75 e tensão de linha de 380 V. Qual é aproximadamente a corrente?",
                    alternativas: [
                        "15,2 A",
                        "30,4 A",
                        "45,6 A",
                        "57,0 A"
                    ],
                    correta: 1,
                    explicacao: "I = 15000 / (1,732 × 380 × 0,75), resultando em aproximadamente 30,4 A."
                },
                {
                    categoria: "🎓 CUSTO DE ENERGIA",
                    pergunta: "Um equipamento de 3 kW funciona por 2 horas. Com tarifa de R$ 0,90/kWh, qual é o custo?",
                    alternativas: [
                        "R$ 1,80",
                        "R$ 2,70",
                        "R$ 5,40",
                        "R$ 6,00"
                    ],
                    correta: 2,
                    explicacao: "O consumo é 6 kWh. 6 × R$ 0,90 = R$ 5,40."
                },
                {
                    categoria: "🎓 RESERVATÓRIO",
                    pergunta: "Um reservatório possui 500 L. Com consumo constante de 25 L por dia e sem reposição, por quantos dias ele atende?",
                    alternativas: [
                        "10 dias",
                        "15 dias",
                        "20 dias",
                        "25 dias"
                    ],
                    correta: 2,
                    explicacao: "500 / 25 = 20 dias."
                },
                {
                    categoria: "🎓 EFICIÊNCIA DE ILUMINAÇÃO",
                    pergunta: "Uma lâmpada de 60 W é substituída por uma de 10 W. Ambas funcionam 5 h/dia durante 30 dias. Qual é a economia?",
                    alternativas: [
                        "5,0 kWh",
                        "7,5 kWh",
                        "9,0 kWh",
                        "15,0 kWh"
                    ],
                    correta: 1,
                    explicacao: "A diferença é 50 W. Em 150 horas: 50 × 150 = 7500 Wh = 7,5 kWh."
                }
            ]
        }
    };

    // ========================================
    // FUNCIONAMENTO DOS QUIZZES ANTIGOS
    // ========================================

    const parametros = new URLSearchParams(window.location.search);
    const nivelSelecionado = parametros.get("nivel");
    const configuracaoNivel = niveisQuiz[nivelSelecionado];

    if (!configuracaoNivel) {
        window.location.href = "dificuldade.html";
        return;
    }

    const perguntasQuiz = configuracaoNivel.perguntas;
    const ATIVIDADE_ID = configuracaoNivel.atividadeId;
    const XP_POR_ACERTO = configuracaoNivel.xpPorAcerto;

    let perguntaAtualQuiz = 0;
    let acertosQuiz = 0;
    let respondeuQuiz = false;
    let xpQuiz = 0;
    let respostasQuiz = [];

    const areaQuiz = document.getElementById("quiz-area");
    const resultadoQuiz = document.getElementById("quiz-resultado");
    const btnProximaQuiz = document.getElementById("btn-proxima-quiz");
    const btnRefazerQuiz = document.getElementById("btn-refazer-quiz");
    const contadorQuiz = document.getElementById("quiz-contador");
    const progressoQuiz = document.getElementById("quiz-progresso");
    const categoriaQuiz = document.getElementById("quiz-categoria");
    const perguntaQuiz = document.getElementById("quiz-pergunta");
    const alternativasQuiz = document.getElementById("quiz-alternativas");
    const xpAtualQuiz = document.getElementById("quiz-xp");
    const feedbackQuiz = document.getElementById("quiz-feedback");
    const feedbackIcone = document.getElementById("quiz-feedback-icone");
    const feedbackTitulo = document.getElementById("quiz-feedback-titulo");
    const feedbackTexto = document.getElementById("quiz-feedback-texto");
    const nivelTag = document.getElementById("quiz-nivel-tag");
    const nivelNome = document.getElementById("quiz-nivel-nome");
    const resultadoNivel = document.getElementById("quiz-resultado-nivel");

    function atualizarIdentidadeNivel() {
        if (nivelTag) {
            nivelTag.textContent =
                `${configuracaoNivel.emoji} NÍVEL ${configuracaoNivel.nome.toUpperCase()}`;
        }

        if (nivelNome) {
            nivelNome.textContent = "Quiz Água & Energia";
        }

        if (resultadoNivel) {
            resultadoNivel.textContent =
                `${configuracaoNivel.emoji} ${configuracaoNivel.nome}`;
        }
    }

    function iniciarQuiz() {
        perguntaAtualQuiz = 0;
        acertosQuiz = 0;
        xpQuiz = 0;
        respondeuQuiz = false;
        respostasQuiz = [];

        resultadoQuiz.classList.add("escondido");
        areaQuiz.classList.remove("escondido");

        btnProximaQuiz.textContent = "Próxima pergunta →";

        atualizarIdentidadeNivel();
        mostrarPerguntaQuiz();
    }

    function mostrarPerguntaQuiz() {
        respondeuQuiz = false;
        btnProximaQuiz.disabled = true;

        feedbackQuiz.classList.add("escondido");

        const dadosPergunta = perguntasQuiz[perguntaAtualQuiz];

        contadorQuiz.textContent =
            `Pergunta ${perguntaAtualQuiz + 1} de ${perguntasQuiz.length}`;

        categoriaQuiz.textContent = dadosPergunta.categoria;
        perguntaQuiz.textContent = dadosPergunta.pergunta;
        xpAtualQuiz.textContent = `${xpQuiz} XP`;

        const progresso =
            (perguntaAtualQuiz / perguntasQuiz.length) * 100;

        progressoQuiz.style.width = `${progresso}%`;

        alternativasQuiz.innerHTML = "";

        dadosPergunta.alternativas.forEach((alternativa, indice) => {
            const botao = document.createElement("button");

            botao.type = "button";
            botao.classList.add("quiz-alternativa");

            botao.innerHTML = `
                <span class="quiz-alternativa-letra">
                    ${String.fromCharCode(65 + indice)}
                </span>
                <span class="quiz-alternativa-texto">
                    ${alternativa}
                </span>
            `;

            botao.addEventListener("click", function () {
                responderQuiz(indice);
            });

            alternativasQuiz.appendChild(botao);
        });
    }

    function responderQuiz(indiceEscolhido) {
        if (respondeuQuiz) return;

        respondeuQuiz = true;

        respostasQuiz[perguntaAtualQuiz] = indiceEscolhido;

        const dadosPergunta = perguntasQuiz[perguntaAtualQuiz];
        const respostaCorreta = dadosPergunta.correta;

        const botoes = alternativasQuiz.querySelectorAll(
            ".quiz-alternativa"
        );

        botoes.forEach(botao => {
            botao.disabled = true;
        });

        const acertou = indiceEscolhido === respostaCorreta;

        botoes[respostaCorreta].classList.add("correta");

        if (acertou) {
            acertosQuiz++;
        } else {
            botoes[indiceEscolhido].classList.add("errada");
        }

        xpQuiz = acertosQuiz * XP_POR_ACERTO;
        xpAtualQuiz.textContent = `${xpQuiz} XP`;

        mostrarFeedbackQuiz(
            acertou,
            dadosPergunta.explicacao
        );

        btnProximaQuiz.disabled = false;

        btnProximaQuiz.textContent =
            perguntaAtualQuiz === perguntasQuiz.length - 1
                ? "Ver resultado →"
                : "Próxima pergunta →";
    }

    function mostrarFeedbackQuiz(acertou, explicacao) {
        feedbackQuiz.classList.remove("escondido");

        if (acertou) {
            feedbackIcone.textContent = "🎉";
            feedbackTitulo.textContent = "Muito bem!";
        } else {
            feedbackIcone.textContent = "💡";
            feedbackTitulo.textContent = "Quase!";
        }

        feedbackTexto.textContent = explicacao;
    }

    function proximaPerguntaQuiz() {
        if (!respondeuQuiz) return;

        if (perguntaAtualQuiz < perguntasQuiz.length - 1) {
            perguntaAtualQuiz++;
            mostrarPerguntaQuiz();
        } else {
            finalizarQuiz();
        }
    }

    async function finalizarQuiz() {
        areaQuiz.classList.add("escondido");
        resultadoQuiz.classList.remove("escondido");

        progressoQuiz.style.width = "100%";

        const erros = perguntasQuiz.length - acertosQuiz;

        document.getElementById("quiz-total-acertos").textContent =
            acertosQuiz;

        document.getElementById("quiz-total-erros").textContent =
            erros;

        atualizarIdentidadeNivel();
        atualizarMensagemFinal();

        const elementoXp = document.getElementById("quiz-xp-ganho");

        elementoXp.textContent = "Salvando...";

        const resultado = await concluirAtividade();

        if (!resultado) {
            elementoXp.textContent = "Erro ao salvar";
            return;
        }

        elementoXp.textContent = resultado.primeiraConclusao
            ? `+${resultado.xpGanho} XP`
            : "0 XP";
    }

    function atualizarMensagemFinal() {
        const titulo = document.getElementById("quiz-mensagem-titulo");
        const texto = document.getElementById("quiz-mensagem-texto");
        const emoji = document.getElementById("quiz-resultado-emoji");

        if (acertosQuiz >= 9) {
            emoji.textContent = "🏆";
            titulo.textContent = "Excelente!";

            texto.textContent =
                `Você dominou o nível ${configuracaoNivel.nome}!`;
        } else if (acertosQuiz >= 7) {
            emoji.textContent = "🌟";
            titulo.textContent = "Muito bem!";

            texto.textContent =
                `Você teve um ótimo desempenho no nível ${configuracaoNivel.nome}.`;
        } else if (acertosQuiz >= 5) {
            emoji.textContent = "🌱";
            titulo.textContent = "Bom trabalho!";

            texto.textContent =
                "Você já sabe bastante. Continue aprendendo para melhorar ainda mais.";
        } else {
            emoji.textContent = "💡";
            titulo.textContent = "Continue aprendendo!";

            texto.textContent =
                `O nível ${configuracaoNivel.nome} é um desafio. Tente novamente depois de aprender um pouco mais.`;
        }
    }

    async function concluirAtividade() {
        btnProximaQuiz.disabled = true;
        btnRefazerQuiz.disabled = true;

        try {
            const resposta = await fetch(
                "/api/atividade/concluir",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        atividadeId: ATIVIDADE_ID,
                        respostas: respostasQuiz
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                if (resposta.status === 401) {
                    localStorage.removeItem("ecoUsuario");
                }

                alert(
                    dados.mensagem ||
                    "Não foi possível salvar o resultado."
                );

                return null;
            }

            try {
                localStorage.setItem(
                    "ecoUsuario",
                    JSON.stringify(dados.usuario)
                );
            } catch (erro) {
                console.warn(
                    "Não foi possível atualizar o cache:",
                    erro
                );
            }

            return dados;
        } catch (erro) {
            console.error("Erro ao enviar atividade:", erro);

            alert(
                "Não foi possível confirmar o salvamento. " +
                "Verifique se o servidor está rodando."
            );

            return null;
        } finally {
            btnRefazerQuiz.disabled = false;
        }
    }

    function refazerQuiz() {
        iniciarQuiz();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    if (btnProximaQuiz) {
        btnProximaQuiz.addEventListener(
            "click",
            proximaPerguntaQuiz
        );
    }

    if (btnRefazerQuiz) {
        btnRefazerQuiz.addEventListener(
            "click",
            refazerQuiz
        );
    }

    iniciarQuiz();
})();      