"use strict";

// correta: 0 = A, 1 = B, 2 = C, 3 = D.
// Os IDs foram mantidos para preservar o progresso existente.

const categorias = {
    sustentabilidade: "🌱 CUIDAR DA NATUREZA",
    agua: "💧 CUIDADO COM A ÁGUA",
    energia: "⚡ ENERGIA NO DIA A DIA",
    consumo: "💡 EVITAR DESPERDÍCIO",
    reaproveitamento: "♻️ USAR DE NOVO",
    fontes: "☀️ SOL, VENTO E ÁGUA"
};

function criarPergunta(numero, tema, pergunta, alternativas, correta, explicacoesAlternativas) {
    return {
        id: "facil_p" + String(numero).padStart(3, "0") + "_v1",
        tema,
        categoria: categorias[tema],
        pergunta,
        alternativas,
        correta,

        // Mantém a compatibilidade com a correção atual.
        explicacao: explicacoesAlternativas[correta],

        // Uma explicação para cada opção, na mesma ordem das alternativas.
        explicacoesAlternativas
    };
}

function criarBloco(modulo, numero, nome, perguntas) {
    return {
        atividadeId:
            "trilha_facil_m" + String(modulo).padStart(2, "0") +
            "_b" + String(numero).padStart(2, "0") + "_v1",
        nome,
        ordem: numero,
        perguntas: perguntas.slice(0, 5)
    };
}

const trilhaFacil = {
    nivel: "facil",
    nome: "Fácil",
    emoji: "🌱",
    versao: 1,
    xpPorAcerto: 10,
    modulos: []
};

// =========================================================
// MÓDULO 1
// =========================================================

trilhaFacil.modulos.push({
    id: "facil_m01_v1",
    nome: "Descobrindo a energia",
    ordem: 1,
    introducao: "Vamos descobrir como cuidar da água, da energia e da natureza.",
    blocos: [
        criarBloco(1, 1, "Primeiras descobertas", [
            criarPergunta(1, "sustentabilidade", "Qual atitude mostra cuidado com a natureza?",
                ["Jogar papel no chão.", "Deixar a torneira aberta sem usar.", "Usar água sem desperdiçar.", "Deixar a luz acesa sem precisar."], 2,
                ["O papel no chão suja o lugar e pode chegar aos rios.", "A água corre sem ninguém precisar dela.", "Usar só a água necessária ajuda a evitar desperdício.", "A luz acesa usa energia mesmo sem ninguém precisar."]),

            criarPergunta(2, "sustentabilidade", "Por que cuidamos da água e da energia?",
                ["Precisamos delas no dia a dia.", "Elas servem só para brincar.", "Só os adultos precisam delas.", "Podemos gastar sem nenhum cuidado."], 0,
                ["Usamos água e energia para beber, iluminar e fazer muitas coisas.", "Água e energia também ajudam em muitas tarefas importantes.", "Crianças também precisam de água e usam energia.", "Gastar sem cuidado pode causar desperdício."]),

            criarPergunta(3, "sustentabilidade", "Quem ganha quando cuidamos da natureza?",
                ["Só quem mora na floresta.", "Pessoas, animais e plantas.", "Só quem mora na cidade.", "Só os adultos."], 1,
                ["A natureza também é importante longe das florestas.", "Pessoas, animais e plantas precisam da natureza para viver.", "Quem vive fora das cidades também depende da natureza.", "As crianças também precisam de um lugar bem cuidado."]),

            criarPergunta(4, "reaproveitamento", "O que é reaproveitar um objeto?",
                ["Jogar fora depois de usar.", "Comprar outro igual.", "Deixar estragar num canto.", "Usar de novo."], 3,
                ["Jogar fora encerra o uso de algo que talvez ainda sirva.", "Comprar outro não aproveita o objeto que já existe.", "Um objeto que estraga pode deixar de servir.", "Usar de novo aproveita melhor o que já temos."]),

            criarPergunta(5, "sustentabilidade", "Qual dupla de atitudes ajuda o planeta?",
                ["Gastar água e jogar lixo no chão.", "Fechar torneiras e apagar luzes sem uso.", "Deixar torneiras pingando e luzes acesas.", "Jogar papel fora e comprar mais."], 1,
                ["Essas atitudes desperdiçam água e sujam o ambiente.", "Esses cuidados evitam gastar água e energia sem precisar.", "Pingos e luzes sem uso também causam desperdício.", "Vale conferir se o papel ainda pode ser usado."])
        ]),

        criarBloco(1, 2, "Energia em ação", [
            criarPergunta(9, "energia", "A professora explicou que todos podemos ajudar a cuidar do planeta. Qual atitude podemos ter para isso?",
                [" Usar água e energia sem se preocupar com o amanhã.", "Cuidar da água e energia, evitando desperdícios.", "Comprar coisas novas", "Jogar fora objetos que ainda podem ser usados."], 1,
                ["Usar água e energia sem se preocupar com o amanhã pode prejudicar o planeta", "Cuidar do uso da água e energia ajuda o planeta.", "Comprar novas coisas não ajuda a cuidar do planeta.", "Jogar fora objetos que ainda podem ser usados pode prejudicar o planeta."]),

            criarPergunta(10, "energia", "Sofia tem um caderno com várias páginas em branco do ano passado. Qual atitude poderia ajudar o planeta?",
                ["Quando ninguém está no quarto.", "Depois que todos saem.", "Quando alguém precisa ler.", "Quando a mesa não está em uso."], 2,
                ["Sem ninguém no quarto, essa luz pode ficar acesa à toa.", "Depois que todos saem, é preciso conferir se a luz é necessária.", "A luz ajuda a enxergar as palavras do livro.", "Uma luz sem uso pode gastar energia sem necessidade."]),

            criarPergunta(11, "energia", "Para que serve a geladeira?",
                ["Lavar os alimentos.", "Esquentar a comida.", "Manter os alimentos frios.", "Misturar os alimentos."], 2,
                ["Guardar na geladeira não lava os alimentos.", "A geladeira esfria os alimentos, em vez de esquentar.", "O frio ajuda a conservar os alimentos que precisam dele.", "Misturar alimentos não é a função da geladeira."]),

            criarPergunta(12, "energia", "O que a energia faz num ventilador ligado?",
                ["Lava as pás.", "Faz as pás girarem.", "Produz água.", "Congela os alimentos."], 1,
                ["A limpeza do ventilador precisa de outros cuidados.", "As pás giram e movimentam o ar ao redor.", "O ventilador movimenta o ar, sem produzir água.", "O ventilador não funciona como um congelador."]),

            criarPergunta(13, "energia", "Quando precisamos acender uma luz?",
                ["Na sala vazia e bem clara.", "No quarto vazio durante o dia.", "Ao sair de um lugar vazio.", "Para enxergar num corredor escuro."], 3,
                ["Esse lugar já está claro e ninguém está usando.", "Uma luz num quarto vazio pode ficar acesa sem necessidade.", "Ao sair, vale conferir se a luz ainda precisa ficar acesa.", "A luz ajuda a caminhar com segurança no escuro."])
        ]),

        criarBloco(1, 3, "Olhar e escutar", [
            criarPergunta(17, "agua", "A torneira fechada continua pingando. O que pode estar acontecendo?",
                ["Um vazamento.", "Uma economia de água.", "Uma limpeza da pia.", "Uma chuva dentro de casa."], 0,
                ["Os pingos podem indicar um problema. Avise um adulto.", "Água pingando sem uso também é desperdício.", "Pingar sem parar não é uma forma de limpar a pia.", "Essas gotas estão saindo da torneira, não das nuvens."]),

            criarPergunta(18, "consumo", "A janela já ilumina bem sua mesa. O que fazer?",
                ["Aproveitar a claridade da janela.", "Acender mais duas lâmpadas.", "Fechar a cortina e acender luzes.", "Deixar a lâmpada ligada sem precisar."], 0,
                ["A luz do dia pode iluminar a mesa sem usar uma lâmpada.", "Mais lâmpadas não são necessárias se a mesa já está clara.", "Fechar a cortina pode tirar a claridade que já ajuda.", "Uma lâmpada acesa continua usando energia."]),

            criarPergunta(19, "consumo", "Ninguém está vendo televisão. O que evita desperdício?",
                ["Abaixar só o volume.", "Mudar o canal e sair.", "Desligar pelo botão ou controle.", "Deixar um desenho passando."], 2,
                ["Mesmo sem som, a televisão ligada usa energia.", "Trocar o canal mantém a televisão ligada.", "Desligar a televisão evita deixá-la funcionando sem uso.", "Um desenho passando usa energia mesmo sem ninguém assistir."]),

            criarPergunta(20, "agua", "Qual uso da água é importante no dia a dia?",
                ["Deixar a mangueira aberta sem usar.", "Beber água quando sentimos sede.", "Deixar a torneira aberta ao conversar.", "Encher um copo até transbordar."], 1,
                ["Uma mangueira aberta sem uso desperdiça água.", "Beber água é importante. Economizar não é deixar de beber.", "Conversar não exige deixar a água correndo.", "A água que transborda não fica dentro do copo."]),

            criarPergunta(21, "agua", "O balde encheu e a água está caindo no chão. O que fazer?",
                ["Deixar a água correr.", "Sair sem olhar o balde.", "Fechar a torneira.", "Abrir ainda mais a torneira."], 2,
                ["O balde cheio não consegue guardar essa água extra.", "A água continuará caindo se a torneira ficar aberta.", "Fechar a torneira impede que mais água transborde.", "Abrir mais aumenta a água que está sendo desperdiçada."])
        ]),

        criarBloco(1, 4, "De onde vem?", [
            criarPergunta(25, "agua", "Por onde a água passa antes de chegar à torneira?",
                ["O fio da televisão.", "O cabo do carregador.", "A lâmpada da cozinha.", "Os canos de água."], 3,
                ["O fio da televisão não transporta água.", "O carregador serve para levar energia a um aparelho.", "A lâmpada ilumina, mas não leva água à torneira.", "A água passa pelos canos até chegar à torneira."]),

            criarPergunta(26, "agua", "Você encontrou água num riacho. Antes de beber, o que fazer?",
                ["Pedir orientação a um adulto.", "Beber só porque parece limpa.", "Provar para ver se é boa.", "Beber depois de mexer com a mão."], 0,
                ["Um adulto deve ajudar a encontrar água própria para beber.", "A água pode ter sujeira que nossos olhos não veem.", "O gosto não garante que a água seja segura.", "Mexer com a mão não torna a água própria para beber."]),

            criarPergunta(27, "energia", "Por onde a eletricidade chega a muitas casas?",
                ["Pelos fios da rede elétrica.", "Pelos canos de água.", "Pelos ralos do banheiro.", "Pelas mangueiras do jardim."], 0,
                ["Os fios levam eletricidade. Observe de longe e nunca toque neles.", "Canos de água têm outra função.", "Ralos levam embora a água usada.", "Mangueiras transportam água, não a eletricidade da rede."]),

            criarPergunta(28, "fontes", "O painel solar usa o quê para fazer eletricidade?",
                ["A água do balde.", "A luz do Sol.", "O sabão da pia.", "O som da televisão."], 1,
                ["Esse painel não usa a água de um balde.", "Esse tipo de painel transforma luz do Sol em eletricidade.", "Sabão não é a fonte de energia desse painel.", "O som da televisão não faz o painel solar funcionar."]),

            criarPergunta(29, "energia", "Para que um adulto liga um aparelho na tomada?",
                ["Para lavar o aparelho.", "Para guardar água dentro dele.", "Para pintar o aparelho.", "Para levar eletricidade até ele."], 3,
                ["A tomada não serve para lavar aparelhos.", "Água deve ficar longe de tomadas e partes elétricas.", "A tomada não muda a pintura do aparelho.", "A tomada liga o aparelho à eletricidade. Peça ajuda a um adulto."])
        ]),

        criarBloco(1, 5, "Ligando as ideias", [
            criarPergunta(33, "consumo", "O que é evitar desperdício?",
                ["Usar o que precisamos, com cuidado.", "Gastar tudo de uma vez.", "Deixar de beber água.", "Ficar no escuro sem enxergar."], 0,
                ["Podemos usar água e energia sem gastar à toa.", "Gastar tudo sem pensar pode causar desperdício.", "Precisamos continuar bebendo água quando necessário.", "A luz é importante quando precisamos enxergar."]),

            criarPergunta(34, "agua", "Ao passar sabão nas mãos, como cuidar da água?",
                ["Deixar a torneira bem aberta.", "Deixar a água cair sem usar.", "Sair e deixar a torneira aberta.", "Fechar a torneira enquanto ensaboa."], 3,
                ["A água não precisa correr enquanto passamos sabão.", "Água caindo sem uso é desperdício.", "A água continuará correndo depois que você sair.", "Depois, abra para enxaguar e lave bem as mãos."]),

            criarPergunta(35, "energia", "Qual atividade usa água e energia elétrica?",
                ["Desenhar com lápis.", "Tomar banho com chuveiro elétrico aquecendo.", "Ler perto da janela.", "Brincar de bola no quintal."], 1,
                ["O desenho com lápis não precisa de água correndo nem eletricidade.", "O chuveiro usa água e eletricidade para aquecê-la.", "A claridade da janela pode ajudar nessa leitura.", "Essa brincadeira não precisa de um aparelho elétrico ligado."]),

            criarPergunta(36, "reaproveitamento", "O verso da folha está limpo. Como aproveitar?",
                ["Jogar a folha fora.", "Amassar e deixar no chão.", "Pegar outra folha para rascunho.", "Desenhar no lado limpo."], 3,
                ["A folha ainda tem um lado que pode ser usado.", "Isso suja o lugar e deixa de aproveitar o papel.", "Para um rascunho, o lado limpo pode ser suficiente.", "Usar o verso aproveita melhor a mesma folha."]),

            criarPergunta(37, "sustentabilidade", "Como a turma pode cuidar da natureza?",
                ["Cuidar só no dia da festa.", "Deixar tudo para uma pessoa.", "Praticar pequenos cuidados todos os dias.", "Cuidar na escola e desperdiçar em casa."], 2,
                ["A natureza precisa de cuidado também nos outros dias.", "Todos podem participar, cada um do seu jeito.", "Pequenos cuidados podem fazer parte da nossa rotina.", "Os cuidados também são importantes em casa."])
        ])
    ]
});

// =========================================================
// MÓDULO 2
// =========================================================

trilhaFacil.modulos.push({
    id: "facil_m02_v1",
    nome: "Energia em casa e na escola",
    ordem: 2,
    introducao: "Vamos praticar pequenos cuidados em casa e na escola.",
    blocos: [
        criarBloco(2, 1, "Uma casa cheia de energia", [
            criarPergunta(41, "consumo", "A família vai ler na sala. Quais luzes usar?",
                ["Todas as luzes da casa.", "As necessárias para ler bem.", "As dos quartos vazios.", "Nenhuma, mesmo estando escuro."], 1,
                ["Os outros cômodos podem não precisar de luz.", "A iluminação deve ajudar todos a enxergar sem gastar à toa.", "Luzes dos quartos vazios não ajudam a leitura na sala.", "Ler exige claridade suficiente para enxergar as palavras."]),

            criarPergunta(42, "consumo", "O ar-condicionado está ligado. Qual cuidado ajuda?",
                ["Manter portas e janelas fechadas.", "Deixar a porta aberta para a rua.", "Abrir todas as janelas.", "Deixar o ar frio sair."], 0,
                ["Isso ajuda a manter o ar fresco dentro do ambiente.", "A porta aberta deixa entrar mais ar de fora.", "Janelas abertas podem fazer o aparelho trabalhar mais.", "Perder o ar fresco pode aumentar o trabalho do aparelho."]),

            criarPergunta(43, "consumo", "Antes de abrir a geladeira, o que ajuda?",
                ["Deixar a porta aberta enquanto escolhe.", "Abrir várias vezes sem precisar.", "Pensar no que vai pegar.", "Abrir e ir arrumar a mesa."], 2,
                ["A porta aberta deixa entrar calor na geladeira.", "Abrir muitas vezes deixa entrar mais calor.", "Escolher antes ajuda a fechar a porta mais rápido.", "A porta ficará aberta enquanto você faz outra tarefa."]),

            criarPergunta(44, "consumo", "Como um adulto pode aproveitar uma lavagem de roupas?",
                ["Lavar uma meia de cada vez.", "Juntar roupas, respeitando o limite da máquina.", "Encher a máquina além do limite.", "Lavar de novo roupas já limpas."], 1,
                ["Várias lavagens pequenas podem usar mais água e energia.", "Uma lavagem bem organizada aproveita melhor água e energia.", "Roupas demais podem atrapalhar a lavagem e danificar a máquina.", "Lavar sem necessidade usa água e energia à toa."]),

            criarPergunta(45, "energia", "Já entra uma brisa agradável pela janela. O que aproveitar?",
                ["Um aquecedor ligado.", "Vários ventiladores ligados.", "O vento que já refresca o lugar.", "O ar-condicionado com a janela aberta."], 2,
                ["O aquecedor esquenta o lugar, em vez de refrescar.", "Mais aparelhos podem ser desnecessários se a brisa já ajuda.", "A brisa pode refrescar sem precisar ligar um aparelho.", "A janela aberta deixa escapar o ar que o aparelho resfria."])
        ]),

        criarBloco(2, 2, "Aprender com a rotina", [
            criarPergunta(49, "agua", "Enquanto escovamos os dentes, como deixar a torneira?",
                ["Fechada, abrindo quando precisar.", "Aberta durante toda a escovação.", "Aberta mesmo depois de sair.", "No máximo, para correr bastante."], 0,
                ["A água não precisa correr enquanto a escova limpa os dentes.", "A água corre sem ser usada durante boa parte da escovação.", "Depois de sair, ninguém estará usando essa água.", "Abrir no máximo pode gastar água sem necessidade."]),

            criarPergunta(50, "agua", "Qual cuidado evita desperdício no banho?",
                ["Brincar com o chuveiro ligado.", "Ligar antes de procurar a toalha.", "Deixar a água correr depois de sair.", "Terminar depois de se lavar bem."], 3,
                ["O banho fica mais demorado com água correndo sem necessidade.", "A água ficará correndo enquanto você procura a toalha.", "Depois de sair, a água já não está sendo usada.", "Podemos cuidar da limpeza sem prolongar o banho à toa."]),

            criarPergunta(51, "agua", "Antes de regar, o que observar com um adulto?",
                ["A cor do regador.", "O desenho do vaso.", "Se a terra está seca ou molhada.", "O tamanho da janela."], 2,
                ["A cor do regador não mostra se a planta precisa de água.", "O desenho do vaso não mostra a umidade da terra.", "Olhar a terra ajuda a decidir se a planta precisa de água.", "O tamanho da janela não responde se a terra está seca."]),

            criarPergunta(52, "agua", "Um adulto ensaboa a louça. Como evitar água correndo à toa?",
                ["Deixar a torneira aberta.", "Fechar a torneira nessa etapa.", "Abrir mais a torneira.", "Deixar a pia transbordar."], 1,
                ["A água pode correr sem ser usada enquanto a louça é ensaboada.", "A torneira pode ser aberta depois, para enxaguar.", "Abrir mais aumenta a quantidade de água correndo.", "Água transbordando é desperdício e molha o chão."]),

            criarPergunta(53, "agua", "Você vai beber água. Como evitar sobras no copo?",
                ["Beber menos do que precisa.", "Encher vários copos antes de beber.", "Servir um pouco e pegar mais se precisar.", "Encher até a água cair."], 2,
                ["Economizar não deve impedir você de beber a água necessária.", "Vários copos cheios podem deixar mais água sobrando.", "Você pode servir mais sempre que ainda tiver sede.", "A água que cai para fora do copo é desperdiçada."])
        ]),

        criarBloco(2, 3, "Pequenas escolhas", [
            criarPergunta(57, "reaproveitamento", "Como cuidar da sua garrafa de água reutilizável?",
                ["Usar sempre sem lavar.", "Trocar por uma nova todo dia.", "Jogar fora depois de beber.", "Lavar e usar novamente."], 3,
                ["A garrafa precisa de limpeza para continuar sendo usada.", "Uma garrafa em bom estado pode durar muito mais.", "Essa garrafa foi feita para ser usada mais vezes.", "Limpar e cuidar da garrafa permite usá-la de novo."]),

            criarPergunta(58, "agua", "Você terminou de usar a torneira da escola. E agora?",
                ["Abrir mais para o colega.", "Esperar alguém chegar com ela aberta.", "Sair e deixar a água correr.", "Fechar antes de sair."], 3,
                ["O colega pode abrir a torneira quando precisar.", "A água ficará correndo sem ninguém usar.", "Deixar a água correr depois do uso causa desperdício.", "A próxima pessoa pode abrir quando for usar."]),

            criarPergunta(59, "consumo", "A turma vai ao pátio. O que combinar com o professor?",
                ["Deixar todas as luzes acesas.", "Apagar as luzes da sala vazia.", "Acender as luzes de outras salas vazias.", "Deixar a televisão ligada sem uso."], 1,
                ["A sala vazia pode não precisar dessas luzes.", "O professor pode orientar quais luzes podem ser apagadas.", "Mais salas vazias iluminadas podem aumentar o desperdício.", "Uma televisão sem uso continua gastando energia."]),

            criarPergunta(60, "consumo", "A atividade no tablet acabou. O que poupa a bateria?",
                ["Apagar a tela, seguindo a orientação do adulto.", "Deixar um vídeo passando.", "Aumentar o brilho e guardar.", "Deixar um jogo aberto na tela."], 0,
                ["A tela apagada usa menos energia do que a tela acesa.", "O vídeo continua usando energia sem ninguém assistir.", "A tela muito brilhante continua usando energia.", "O jogo e a tela acesa continuam usando a bateria."]),

            criarPergunta(61, "agua", "Como juntar folhas secas da calçada sem gastar água?",
                ["Usar uma vassoura.", "Usar a mangueira aberta.", "Jogar vários baldes de água.", "Deixar a torneira lavar sozinha."], 0,
                ["A vassoura junta as folhas sem precisar de água.", "A mangueira gasta água para empurrar as folhas.", "Os baldes usam água numa tarefa que pode ser feita a seco.", "Água correndo sozinha pode causar muito desperdício."])
        ]),

        criarBloco(2, 4, "Cada coisa tem seu jeito", [
            criarPergunta(65, "energia", "A geladeira tem comida. O que fazer ao sair de casa?",
                ["Deixá-la funcionando e fechada.", "Desligar junto com as luzes.", "Deixar a porta aberta.", "Tirar toda a comida sem precisar."], 0,
                ["Ela precisa manter o frio para conservar os alimentos.", "A geladeira pode precisar continuar funcionando para conservar a comida.", "A porta aberta deixa o frio escapar e o calor entrar.", "Os alimentos podem precisar continuar guardados no frio."]),

            criarPergunta(66, "energia", "A televisão está ligada sem som. Ela usa energia?",
                ["Não, porque está sem som.", "Sim, porque continua funcionando.", "Só quando alguém olha a tela.", "Só quando passa um desenho."], 1,
                ["A tela e outras partes continuam funcionando sem som.", "Mesmo sem som, a televisão ligada ainda usa energia.", "A televisão usa energia mesmo sem ninguém olhando.", "O tipo de programa não elimina o uso de energia."]),

            criarPergunta(67, "consumo", "Duas lâmpadas iluminam igual. Qual ajuda a economizar?",
                ["A que tem a caixa maior.", "A que tem a embalagem mais bonita.", "A que gasta mais energia.", "A que gasta menos energia."], 3,
                ["O tamanho da caixa não mostra o gasto de energia.", "A embalagem bonita não garante menor gasto.", "Gastar mais para iluminar igual não ajuda a economizar.", "Ela oferece a mesma luz usando menos energia."]),

            criarPergunta(68, "consumo", "Um adulto vai aquecer água para uma bebida. Quanto aquecer?",
                ["Uma panela cheia sem precisar.", "Água para muitas bebidas que ninguém quer.", "A quantidade que será usada.", "A mesma água várias vezes à toa."], 2,
                ["Aquecer água que vai sobrar pode gastar energia à toa.", "Essa água extra também precisa de energia para aquecer.", "Aquecer só o necessário evita gastar energia com água extra.", "Aquecer de novo sem necessidade usa mais energia."]),

            criarPergunta(69, "agua", "Num banho frio, ainda precisamos cuidar da água?",
                ["Não, porque só água quente importa.", "Sim, porque o banho continua usando água.", "Só quando a água acaba.", "Não, porque água fria pode correr à toa."], 1,
                ["A água fria também precisa ser usada com cuidado.", "Mesmo sem aquecer, o chuveiro continua usando água.", "O cuidado deve acontecer antes de faltar água também.", "Água fria correndo sem uso também é desperdício."])
        ]),

        criarBloco(2, 5, "Cuidar e aproveitar", [
            criarPergunta(73, "agua", "Você viu um cano vazando na escola. O que fazer?",
                ["Esperar muitos dias sem avisar.", "Avisar o professor e dizer onde fica.", "Esconder o problema com papel.", "Tentar abrir o cano sozinho."], 1,
                ["O vazamento pode continuar perdendo água durante esses dias.", "O professor pode chamar ajuda para resolver o problema.", "Cobrir a água não conserta o vazamento.", "Consertos precisam de uma pessoa preparada para a tarefa."]),

            criarPergunta(74, "energia", "O fio do carregador está estragado. O que fazer?",
                ["Continuar usando normalmente.", "Puxar a parte estragada.", "Encostar para ver o defeito.", "Ficar longe e avisar um adulto."], 3,
                ["Um fio estragado pode causar choque. Não continue usando.", "Puxar um fio estragado pode machucar ou causar choque.", "Tocar na parte estragada é perigoso.", "Um adulto pode buscar ajuda para trocar ou avaliar o carregador."]),

            criarPergunta(75, "reaproveitamento", "Uma camiseta ficou pequena, mas está boa. O que fazer?",
                ["Doar com a ajuda da família.", "Jogar fora só por ficar pequena.", "Rasgar antes de guardar.", "Deixar molhada até estragar."], 0,
                ["Outra pessoa pode continuar usando a camiseta.", "Ela ainda pode servir para outra pessoa.", "Rasgar pode impedir que a roupa continue sendo usada.", "Uma roupa estragada pode deixar de ser útil."]),

            criarPergunta(76, "reaproveitamento", "Qual caixa pode virar um porta-lápis?",
                ["Uma caixa suja de produto de limpeza.", "Uma caixa com pontas que cortam.", "Uma caixa molhada e rasgada.", "Uma caixa limpa, firme e segura."], 3,
                ["Restos de produto de limpeza podem fazer mal.", "Pontas cortantes podem machucar as mãos.", "A caixa pode se desfazer e não segurar os lápis.", "Uma caixa segura pode ganhar uma nova função."]),

            criarPergunta(77, "consumo", "Como ajudar um livro a durar mais?",
                ["Rasgar as páginas.", "Deixar aberto na chuva.", "Guardar seco e manusear com cuidado.", "Jogar no chão depois de ler."], 2,
                ["Páginas rasgadas podem atrapalhar a próxima leitura.", "A água da chuva pode estragar o papel.", "Esses cuidados mantêm o livro pronto para outras leituras.", "Jogar no chão pode danificar o livro."])
        ])
    ]
});

// =========================================================
// MÓDULO 3
// =========================================================

trilhaFacil.modulos.push({
    id: "facil_m03_v1",
    nome: "A natureza também ajuda",
    ordem: 3,
    introducao: "Vamos conhecer a luz do Sol, o vento e os caminhos da água.",
    blocos: [
        criarBloco(3, 1, "Fontes para descobrir", [
            criarPergunta(81, "fontes", "O que gira as pás de um gerador de energia do vento?",
                ["O vento.", "O calor do Sol.", "A água de um rio.", "A luz da Lua."], 0,
                ["O vento movimenta as pás e ajuda a produzir eletricidade.", "Nesse equipamento, o calor do Sol não é o que gira as pás.", "Existem equipamentos que usam água, mas esse gerador usa vento.", "Esse gerador precisa de vento, não da luz da Lua."]),

            criarPergunta(82, "fontes", "Uma hidrelétrica é uma usina que gera energia usando o quê?",
                ["Água em movimento.", "Luz do Sol.", "Vento nas pás de uma torre.", "Calor de uma fogueira."], 0,
                ["A água movimenta equipamentos que ajudam a produzir eletricidade.", "Painéis solares podem usar luz. A hidrelétrica funciona de outro jeito.", "Geradores do vento usam pás, mas essa usina usa água.", "O calor de uma fogueira não movimenta essa usina."]),

            criarPergunta(83, "fontes", "O que o Sol oferece durante o dia?",
                ["Pedras e areia.", "Folhas e galhos.", "Sabão e espuma.", "Luz e calor."], 3,
                ["Pedras e areia não são produzidas pelo Sol durante o dia.", "Folhas e galhos fazem parte das plantas.", "Sabão e espuma não vêm do Sol.", "A luz ilumina e o calor do Sol aquece."]),

            criarPergunta(84, "fontes", "Qual atividade aproveita o calor do Sol?",
                ["Guardar comida na geladeira.", "Ligar a televisão.", "Secar uma toalha no varal.", "Acender uma lâmpada à noite."], 2,
                ["A geladeira usa eletricidade para manter o frio.", "A televisão ligada usa energia elétrica.", "O calor do Sol ajuda a toalha molhada a secar.", "Essa lâmpada usa eletricidade para iluminar à noite."]),

            criarPergunta(85, "fontes", "Qual destes vem da natureza e pode ajudar a gerar energia?",
                ["O carregador.", "O vento.", "A tomada.", "O interruptor."], 1,
                ["O carregador é um aparelho feito pelas pessoas.", "O vento pode movimentar equipamentos que geram eletricidade.", "A tomada é uma ligação com a instalação elétrica.", "O interruptor ajuda a ligar e desligar a luz."])
        ]),

        criarBloco(3, 2, "Natureza em movimento", [
            criarPergunta(89, "agua", "A roupa molhada secou. Para onde foi parte da água?",
                ["Para o ar, em forma de vapor.", "Ficou toda na roupa seca.", "Virou o tecido da roupa.", "Foi toda para o pregador."], 0,
                ["A água pode virar vapor e passar para o ar.", "A roupa secou porque perdeu parte da água.", "A água não se transforma no tecido da roupa.", "O pregador não guarda toda a água da roupa."]),

            criarPergunta(90, "agua", "Uma poça diminuiu num dia quente. O que pode ter acontecido?",
                ["A água virou pedra.", "A água virou areia.", "Parte da água passou para o ar.", "A água deixou de existir."], 2,
                ["A água da poça não vira pedra quando esquenta.", "O calor não transforma essa água em areia.", "Com o calor, parte da água pode virar vapor.", "A água pode mudar de forma sem deixar de existir."]),

            criarPergunta(91, "agua", "Como a chuva ajuda um rio?",
                ["Transforma o rio em água para beber.", "Leva mais água para ele.", "Faz todo o lixo desaparecer.", "Dispensa todos os cuidados com o rio."], 1,
                ["Mesmo após a chuva, essa água precisa de cuidados antes de beber.", "Parte da água da chuva chega aos rios.", "A chuva pode carregar o lixo para outros lugares.", "Os rios precisam de cuidado mesmo quando chove."]),

            criarPergunta(92, "fontes", "Depois de mover uma roda-d'água, a água pode fazer o quê?",
                ["Virar um fio elétrico.", "Virar uma lâmpada.", "Continuar pelo caminho do rio.", "Deixar de existir."], 2,
                ["A água movimenta a roda, mas não vira um fio.", "Movimentar a roda não transforma a água numa lâmpada.", "Ela continua sendo água depois de movimentar a roda.", "A água continua existindo depois de mover a roda."]),

            criarPergunta(93, "agua", "Por que as plantas precisam de água?",
                ["Para nunca mais precisar de luz.", "Para viver e crescer.", "Para ficar sempre cobertas de água.", "Só para lavar as folhas."], 1,
                ["A água não substitui a luz de que as plantas precisam.", "A água faz parte dos cuidados que ajudam a planta a viver.", "Água demais pode prejudicar muitas plantas.", "A água também é importante dentro da planta."])
        ]),

        criarBloco(3, 3, "Uma viagem pelas fontes", [
            criarPergunta(97, "fontes", "À noite, um painel solar recebe luz do Sol?",
                ["Sim, a mesma luz do dia.", "Não, falta a luz do Sol.", "Sim, porque está no telhado.", "Sim, porque tem fios."], 1,
                ["À noite, o painel não recebe a mesma luz solar do dia.", "Sem luz solar, esse painel não gera eletricidade com o Sol.", "Estar no telhado não faz o Sol aparecer à noite.", "Os fios não produzem luz do Sol para o painel."]),

            criarPergunta(98, "fontes", "O vento parou. O que acontece com a energia gerada pelo vento?",
                ["Aumenta mesmo sem vento.", "Continua igual com tudo parado.", "Passa a depender só da luz solar.", "Diminui ou para de ser produzida."], 3,
                ["Esse gerador precisa do vento para produzir energia.", "Esse gerador precisa do movimento causado pelo vento.", "Um gerador de vento não vira um painel solar.", "Sem vento para mover as pás, a produção pode parar."]),

            criarPergunta(99, "fontes", "Ficou muito tempo sem chover. O que pode acontecer com um rio?",
                ["Ficar com menos água.", "Ficar sempre mais cheio.", "Ganhar água sem receber de lugar nenhum.", "Deixar de precisar de cuidado."], 0,
                ["Sem chuva por muito tempo, a quantidade de água pode diminuir.", "A falta de chuva não garante que o rio fique mais cheio.", "A água precisa chegar de algum lugar para aumentar.", "O rio continua precisando de cuidado."]),

            criarPergunta(100, "fontes", "Ao instalar painéis solares, os adultos devem fazer o quê?",
                ["Jogar as embalagens no chão.", "Deixar fios soltos ao alcance das crianças.", "Planejar e cuidar do lugar.", "Ignorar os animais e as plantas."], 2,
                ["As embalagens também precisam de um destino adequado.", "Fios e instalações elétricas precisam de cuidados de segurança.", "Usar energia do Sol também pede cuidado com o ambiente.", "Animais e plantas devem ser considerados nesses cuidados."]),

            criarPergunta(101, "consumo", "A casa usa energia do Sol. Como cuidar dessa energia?",
                ["Deixar todas as luzes acesas.", "Ligar aparelhos sem precisar.", "Deixar a televisão ligada sem ninguém ver.", "Desligar o que não está em uso."], 3,
                ["Luzes sem necessidade continuam sendo desperdício.", "A energia do Sol também deve ser bem aproveitada.", "A televisão sem uso pode gastar energia à toa.", "Mesmo com painéis solares, é importante evitar desperdício."])
        ]),

        criarBloco(3, 4, "Recursos ao nosso redor", [
            criarPergunta(105, "agua", "Por que a água do mar não serve para matar a sede?",
                ["Porque só pode ser bebida à noite.", "Porque é sempre muito quente.", "Porque não tem cor.", "Porque tem muito sal."], 3,
                ["O horário não torna a água do mar própria para beber.", "A água do mar não é sempre quente.", "A aparência da água não garante que podemos bebê-la.", "Para beber, precisamos de água própria para consumo, sem tanto sal."]),

            criarPergunta(106, "agua", "Podemos beber a água usada para lavar roupas?",
                ["Sim, se parecer transparente.", "Sim, se estiver fria.", "Não, ela pode ter sabão e sujeira.", "Sim, se colocarmos num copo limpo."], 2,
                ["A aparência transparente não garante que essa água seja segura.", "Esfriar essa água não retira o sabão e a sujeira.", "A água da lavagem não é própria para beber.", "Um copo limpo não limpa a água colocada nele."]),

            criarPergunta(107, "agua", "Seu papel de lanche caiu perto do rio. O que fazer?",
                ["Jogar o papel na água.", "Recolher, se for seguro, e levar à lixeira.", "Esconder o papel nas pedras.", "Deixar para a chuva levar."], 1,
                ["O lixo na água pode prejudicar o rio e os animais.", "Guardar o próprio lixo ajuda a proteger a água.", "O papel continua no ambiente mesmo escondido.", "A chuva pode levar esse lixo para dentro do rio."]),

            criarPergunta(108, "agua", "Por que o adulto não deve jogar óleo usado no ralo?",
                ["Pode entupir canos e poluir a água.", "O óleo deixa o rio limpo.", "O óleo vira água potável.", "O óleo conserta os canos."], 0,
                ["O adulto deve procurar um local que receba óleo usado.", "O óleo pode poluir a água, em vez de limpar.", "Jogar no ralo não transforma óleo em água para beber.", "O óleo pode atrapalhar a passagem da água nos canos."]),

            criarPergunta(109, "agua", "Além das pessoas, quem precisa de água?",
                ["Só as plantas de dentro de casa.", "Animais e plantas.", "Só os peixes do mar.", "Só os aparelhos da cozinha."], 1,
                ["As plantas que vivem fora de casa também precisam de água.", "A água é importante para a vida de animais e plantas.", "Outros animais também precisam de água para viver.", "Aparelhos não substituem os seres vivos que precisam de água."])
        ]),

        criarBloco(3, 5, "Juntando as descobertas", [
            criarPergunta(113, "agua", "Por que água transparente nem sempre pode ser bebida?",
                ["Porque só podemos beber água colorida.", "Porque toda água transparente é salgada.", "Porque pode ter sujeira que não vemos.", "Porque a transparência deixa a água quente."], 2,
                ["A cor não indica se uma água é própria para beber.", "Uma água transparente pode ter ou não ter sal.", "Um adulto deve ajudar a escolher água própria para beber.", "A transparência não faz a água ficar quente."]),

            criarPergunta(114, "sustentabilidade", "Cuidar de um rio ajuda quem?",
                ["Só quem mora na margem.", "Só quem vai passear nele.", "Só os peixes maiores.", "Pessoas, animais e plantas de vários lugares."], 3,
                ["A água do rio pode seguir para outros lugares também.", "O rio é importante mesmo para quem não passeia nele.", "Muitos seres vivos dependem da água do rio.", "A água segue seu caminho e ajuda muitos seres vivos."]),

            criarPergunta(115, "fontes", "Qual grupo pode fornecer energia da natureza?",
                ["Televisão, geladeira e lâmpada.", "Tomada, fio e carregador.", "Sol, vento e água em movimento.", "Caderno, lápis e borracha."], 2,
                ["Esses aparelhos usam energia elétrica para funcionar.", "Essas peças ajudam a levar ou usar eletricidade.", "Equipamentos podem aproveitar essas fontes para produzir eletricidade.", "Esses são materiais escolares, não fontes naturais de energia."]),

            criarPergunta(116, "agua", "Choveu bastante. Como cuidar da água no dia seguinte?",
                ["Continuar evitando desperdício.", "Deixar a torneira aberta à toa.", "Ignorar os vazamentos.", "Gastar sem pensar até parar de chover."], 0,
                ["Mesmo com chuva, a água continua precisando de cuidado.", "A chuva não torna necessário deixar água correr sem uso.", "Vazamentos continuam desperdiçando água depois da chuva.", "Os cuidados devem continuar em dias de chuva e de Sol."]),

            criarPergunta(117, "energia", "O chuveiro elétrico usa água e energia. Como evitar desperdício?",
                ["Deixar ligado depois do banho.", "Usar o banho para brincar por muito tempo.", "Ligar antes de separar a toalha.", "Se lavar bem e terminar sem enrolar."], 3,
                ["Depois do banho, água e energia podem estar sendo gastas à toa.", "Brincar com o chuveiro ligado prolonga o gasto.", "Água e energia serão usadas enquanto você procura a toalha.", "Um banho sem demora desnecessária ajuda a cuidar das duas."])
        ])
    ]
});

// =========================================================
// MÓDULO 4
// =========================================================

trilhaFacil.modulos.push({
    id: "facil_m04_v1",
    nome: "Brincando de cientista",
    ordem: 4,
    introducao: "Vamos observar pistas e descobrir pequenos cuidados para o dia a dia.",
    blocos: [
        criarBloco(4, 1, "O que aconteceu?", [
            criarPergunta(121, "consumo", "A sala ficou escura e está difícil ler. O que fazer?",
                ["Fechar a cortina.", "Acender também as salas vazias.", "Continuar sem conseguir enxergar.", "Acender a luz necessária para ler."], 3,
                ["Fechar a cortina pode tirar ainda mais a claridade da sala.", "As luzes das salas vazias não ajudam essa leitura.", "Precisamos de claridade suficiente para enxergar as palavras.", "Usar a luz quando precisamos dela não é desperdício."]),

            criarPergunta(122, "agua", "A parede perto do cano está molhada. O que fazer?",
                ["Decidir a causa sem verificar.", "Mostrar a um adulto.", "Esconder a mancha com um desenho.", "Abrir a parede sozinho."], 1,
                ["Uma parede molhada pode ter mais de uma causa.", "O adulto pode verificar se existe um vazamento ou outro problema.", "Cobrir a mancha não resolve o que está molhando a parede.", "Abrir uma parede é uma tarefa para pessoas preparadas."]),

            criarPergunta(123, "agua", "A descarga não para de correr. O que fazer?",
                ["Avisar um adulto.", "Deixar correndo o dia inteiro.", "Jogar papel para tentar parar.", "Desmontar a descarga sozinho."], 0,
                ["Um adulto pode buscar o conserto e evitar a perda de água.", "Água correndo sem parar pode ser desperdício.", "Jogar papel pode entupir o vaso e piorar o problema.", "O conserto precisa de uma pessoa preparada."]),

            criarPergunta(124, "fontes", "Uma toalha secou no varal ao Sol. O que ajudou?",
                ["A cor do pregador.", "O barulho da rua.", "O calor do Sol.", "O desenho da parede."], 2,
                ["A cor do pregador não explica a água saindo da toalha.", "O barulho não é o que faz a toalha secar.", "O calor ajuda parte da água a passar para o ar.", "O desenho da parede não ajuda a secar a toalha."]),

            criarPergunta(125, "reaproveitamento", "A turma tem folhas limpas no verso. Como organizar para usar?",
                ["Jogar todas fora.", "Molhar as folhas.", "Guardar numa caixa de rascunhos.", "Rasgar antes de desenhar."], 2,
                ["Essas folhas ainda podem servir para desenhos e rascunhos.", "Molhar pode estragar o papel que ainda está bom.", "A caixa ajuda a encontrar folhas que podem ser usadas de novo.", "Rasgar pode atrapalhar o uso do lado limpo."])
        ]),

        criarBloco(4, 2, "Observar e comparar", [
            criarPergunta(129, "agua", "Ana encheu um copo. Bia encheu dois copos iguais. Quem usou mais água?",
                ["Ana.", "As duas usaram igual.", "Nenhuma usou água.", "Bia."], 3,
                ["Ana encheu um copo, e Bia encheu dois do mesmo tamanho.", "Dois copos cheios guardam mais água do que um igual.", "As duas usaram água para encher os copos.", "Dois copos iguais cheios têm mais água do que um."]),

            criarPergunta(130, "fontes", "Para comparar a secagem ao Sol e à sombra, quais panos usar?",
                ["Um pano seco e outro molhado.", "Um pano grande e outro pequeno.", "Um papel e uma toalha grossa.", "Panos iguais, molhados do mesmo jeito."], 3,
                ["O pano seco já começa diferente do pano molhado.", "O tamanho também pode mudar o tempo de secagem.", "Materiais diferentes podem secar de formas diferentes.", "Panos parecidos ajudam a observar a diferença entre os lugares."]),

            criarPergunta(131, "energia", "Na mesma velocidade, quando o ventilador usa mais energia?",
                ["Quando fica ligado por menos tempo.", "Quando fica ligado por mais tempo.", "Quando fica desligado o dia inteiro.", "O tempo nunca faz diferença."], 1,
                ["Funcionando do mesmo jeito, menos tempo ligado usa menos energia.", "Mais tempo funcionando significa mais energia usada.", "Desligado, o motor não está girando as pás.", "O tempo ligado também influencia a energia usada."]),

            criarPergunta(132, "agua", "Sempre sobra água no seu copo. O que tentar na próxima vez?",
                ["Servir menos e pegar mais se precisar.", "Usar um copo ainda mais cheio.", "Deixar transbordar.", "Parar de beber água."], 0,
                ["Assim, você evita sobras e continua bebendo o necessário.", "Servir mais pode aumentar a sobra que você observou.", "A água que transborda não fica disponível no copo.", "Você continua precisando beber água."]),

            criarPergunta(133, "agua", "Ana fecha a torneira ao escovar. Bia deixa aberta. Quem evita desperdício?",
                ["Bia.", "Ana.", "As duas deixam a água correr igual.", "Quem abre mais a torneira."], 1,
                ["Bia deixa água correndo enquanto não está usando.", "Ana evita água correndo durante a escovação.", "A torneira de Ana fica fechada enquanto ela escova.", "Abrir mais aumenta a água que corre sem uso."])
        ]),

        criarBloco(4, 3, "Fazer perguntas", [
            criarPergunta(137, "agua", "A planta está murcha. O que observar com um adulto antes de regar?",
                ["Se a terra está seca ou molhada.", "Só a cor do vaso.", "Só o desenho da parede.", "Se cabe água até transbordar."], 0,
                ["A terra dá uma pista sobre a necessidade de água.", "A cor do vaso não mostra se falta água.", "O desenho da parede não mostra o que a planta precisa.", "Colocar água demais pode prejudicar a planta."]),

            criarPergunta(138, "consumo", "Qual pergunta ajuda a decidir se o ventilador precisa ficar ligado?",
                ["Ele combina com a parede?", "Há alguém precisando se refrescar aqui?", "A caixa dele era bonita?", "Qual é a cor do botão?"], 1,
                ["Combinar com a parede não mostra a necessidade de uso.", "Observar quem está no lugar ajuda a decidir se ele é necessário.", "A embalagem não explica se alguém precisa do ventilador agora.", "A cor do botão não mostra se o ventilador é necessário."]),

            criarPergunta(139, "agua", "Qual pista mostra uma torneira desperdiçando água?",
                ["A pia tem uma cor bonita.", "A parede está pintada.", "A torneira está brilhando.", "A água pinga sem ninguém usar."], 3,
                ["A cor da pia não mostra se há água sendo perdida.", "A pintura da parede não mostra o uso da torneira.", "Uma torneira brilhante também pode ter vazamento.", "Gotas caindo sem uso mostram água sendo perdida."]),

            criarPergunta(140, "consumo", "Você achou uma luz acesa numa sala vazia. O que anotar?",
                ["A cor do seu tênis.", "Seu lanche favorito.", "O nome do seu brinquedo.", "O lugar onde a luz ficou acesa."], 3,
                ["Seu tênis não ajuda a localizar essa luz.", "O lanche não explica onde está acontecendo o desperdício.", "O brinquedo não ajuda o adulto a encontrar essa sala.", "Saber o lugar ajuda o professor a conferir a situação."]),

            criarPergunta(141, "agua", "Como contar ao professor sobre uma torneira pingando?",
                ["Dizer onde fica e o que viu.", "Culpar um colega sem saber.", "Falar só que alguma coisa aconteceu.", "Esperar que ele descubra sozinho."], 0,
                ["Uma informação clara ajuda o professor a encontrar o problema.", "O objetivo é cuidar da água, sem culpar alguém sem motivo.", "Sem explicar o que aconteceu, fica difícil ajudar.", "Contar o que você viu ajuda a resolver mais cedo."])
        ]),

        criarBloco(4, 4, "Descobrir o motivo", [
            criarPergunta(145, "energia", "Por que fechar a geladeira depois de pegar o lanche?",
                ["A porta aberta faz a comida esfriar mais.", "O ar da cozinha sempre ajuda a gelar.", "A luz da geladeira faz todo o frio.", "A porta aberta deixa entrar calor."], 3,
                ["A porta aberta dificulta manter o interior frio.", "O ar de fora pode levar calor para dentro da geladeira.", "A lâmpada ilumina; ela não é responsável por esfriar os alimentos.", "Com mais calor entrando, a geladeira precisa trabalhar para esfriar."]),

            criarPergunta(146, "agua", "Por que avisar sobre uma torneira que perde pequenas gotas?",
                ["Um copo embaixo conserta a torneira.", "Muitas gotas juntas viram bastante água.", "Gotas pequenas nunca fazem diferença.", "Só um cano grande pode desperdiçar."], 1,
                ["O copo pode juntar água, mas não conserta a torneira.", "Pingando por muito tempo, a torneira perde mais e mais água.", "Com o tempo, pequenas gotas podem somar muita água.", "Uma torneira também pode perder água aos poucos."]),

            criarPergunta(147, "consumo", "Por que abrir a cortina pode ajudar durante o dia?",
                ["A cortina faz a televisão gastar menos.", "A luz da janela pode iluminar a sala.", "A cortina desliga todas as lâmpadas.", "A cortina cria eletricidade."], 1,
                ["Abrir a cortina não muda diretamente o uso da televisão.", "Se a claridade for suficiente, podemos dispensar uma lâmpada.", "Abrir a cortina não aciona os interruptores.", "A cortina deixa a luz entrar, mas não produz eletricidade."]),

            criarPergunta(148, "reaproveitamento", "Por que usar as páginas que ainda estão limpas no caderno?",
                ["Para jogar mais papel fora.", "Para comprar outro sem precisar.", "Para aproveitar o papel que já temos.", "Para deixar o caderno guardado sem usar."], 2,
                ["Usar as páginas restantes ajuda a reduzir o descarte.", "O caderno ainda pode servir antes de precisar de outro.", "Aproveitar essas páginas evita gastar folhas novas sem necessidade.", "Guardar sem usar não aproveita as páginas que sobraram."]),

            criarPergunta(149, "agua", "Como um regador ajuda a cuidar da água?",
                ["Dispensa olhar se a terra está molhada.", "Faz a planta nunca mais precisar de água.", "Ajuda a colocar água no lugar certo.", "Impede qualquer excesso de água."], 2,
                ["Ainda precisamos observar se a planta precisa de água.", "A planta continuará precisando de cuidados ao longo do tempo.", "O regador ajuda a controlar onde e quanto regamos.", "Mesmo com regador, podemos colocar água demais."])
        ]),

        criarBloco(4, 5, "Explicar com suas palavras", [
            criarPergunta(153, "consumo", "A turma passou a apagar luzes de salas vazias. O que melhorou?",
                ["Menos luzes ficam acesas sem uso.", "A escola nunca mais precisa de luz.", "Toda luz acesa virou um erro.", "Não é mais preciso prestar atenção."], 0,
                ["Esse cuidado ajuda a evitar gasto de energia à toa.", "A escola ainda precisa de luz em muitas atividades.", "Algumas luzes são necessárias para enxergar e ter segurança.", "Continuar prestando atenção ajuda a manter o hábito."]),

            criarPergunta(154, "fontes", "O dia ficou muito nublado. Por que o painel solar pode gerar menos?",
                ["O painel sempre quebrou.", "As nuvens sempre aumentam a luz.", "O painel só funciona no calor.", "Pode chegar menos luz do Sol."], 3,
                ["Gerar menos num dia nublado não prova que o painel quebrou.", "As nuvens podem diminuir a luz que chega ao painel.", "Esse painel usa luz do Sol e pode funcionar em dias frios.", "As nuvens podem diminuir a luz que chega ao painel."]),

            criarPergunta(155, "agua", "Como saber se a turma está lembrando de fechar as torneiras?",
                ["Olhar só uma vez no ano.", "Contar apenas quantas torneiras existem.", "Observar em vários dias com o professor.", "Perguntar só a cor das torneiras."], 2,
                ["Uma única olhada não mostra o que acontece nos outros dias.", "A quantidade de torneiras não mostra se estão sendo fechadas.", "Observar mais vezes ajuda a perceber o hábito da turma.", "A cor não mostra se alguém esqueceu a torneira aberta."]),

            criarPergunta(156, "agua", "Você viu uma torneira fechada. O que sabe sobre aquele momento?",
                ["Todas as torneiras estavam fechadas.", "Ninguém na escola usava água.", "Aquela torneira estava fechada.", "Nenhuma torneira da escola tinha vazamento."], 2,
                ["Você viu uma torneira, não todas as outras.", "Outras pessoas poderiam estar usando água em outro lugar.", "Essa informação conta exatamente o que você observou.", "Seria preciso verificar outras torneiras para saber isso."]),

            criarPergunta(157, "sustentabilidade", "Como explicar um cuidado com a água a um colega?",
                ["Contar o que fazer e explicar o motivo.", "Rir quando ele errar.", "Gritar sem deixar ele perguntar.", "Inventar uma história para dar medo."], 0,
                ["Explicar com respeito ajuda o colega a entender e aprender.", "Rir do erro pode deixar o colega triste e sem ajuda.", "Perguntas também fazem parte do aprendizado.", "Podemos ensinar com explicações verdadeiras, sem assustar."])
        ])
    ]
});

// =========================================================
// MÓDULO 5
// =========================================================

trilhaFacil.modulos.push({
    id: "facil_m05_v1",
    nome: "Nossa missão de cuidar",
    ordem: 5,
    introducao: "Vamos usar o que aprendemos para cuidar da natureza junto com outras pessoas.",
    blocos: [
        criarBloco(5, 1, "Escolhas que ajudam", [
            criarPergunta(161, "sustentabilidade", "Como começar uma missão de cuidado com a escola?",
                ["Fazer uma promessa e esquecer.", "Tentar resolver tudo sozinho.", "Escolher um cuidado simples com a turma.", "Esperar sem participar."], 2,
                ["Uma ideia precisa virar uma atitude para ajudar.", "Você pode contar com colegas e adultos.", "Um cuidado simples e combinado é um bom começo.", "Cada pessoa pode participar com uma pequena atitude."]),

            criarPergunta(162, "agua", "A turma viu um vazamento enquanto fazia cartazes. O que fazer?",
                ["Esperar terminar todos os cartazes.", "Cobrir a poça com o cartaz.", "Avisar um adulto sobre o vazamento.", "Ignorar porque já está fazendo cartazes."], 2,
                ["Enquanto isso, o vazamento pode continuar perdendo água.", "Um cartaz não conserta o que está vazando.", "O aviso permite buscar ajuda para resolver o problema.", "Cartazes ajudam a ensinar, mas o vazamento precisa de atenção."]),

            criarPergunta(163, "sustentabilidade", "Qual tarefa uma criança pode fazer numa missão de cuidado?",
                ["Abrir uma tomada.", "Consertar um fio da rua.", "Subir no telhado.", "Observar e contar a um adulto."], 3,
                ["Mexer dentro de tomadas pode causar choque.", "Fios da rua são perigosos. Fique longe deles.", "Subir no telhado pode causar uma queda.", "Observar com segurança e avisar é uma forma de ajudar."]),

            criarPergunta(164, "consumo", "Como lembrar das luzes ao sair da sala?",
                ["Deixar todas ligadas sempre.", "Combinar a verificação com o professor.", "Esperar que alguém adivinhe a tarefa.", "Apagar qualquer luz da escola sem avisar."], 1,
                ["Manter todas ligadas pode causar desperdício.", "Um combinado ajuda a lembrar quais luzes podem ser apagadas.", "Um combinado claro ajuda mais do que deixar a tarefa sem dono.", "Algumas luzes são necessárias. Siga a orientação do professor."]),

            criarPergunta(165, "sustentabilidade", "Um colega esqueceu a torneira aberta. Como ajudar?",
                ["Lembrar com gentileza e fechar a torneira.", "Rir dele na frente da turma.", "Deixar correr para ele levar bronca.", "Dizer que só ele deve cuidar da água."], 0,
                ["A gentileza ajuda o colega a aprender e evita desperdício.", "Rir não ensina o cuidado e pode magoar o colega.", "Deixar a água correr aumenta o desperdício.", "Cuidar da água é uma tarefa que podemos compartilhar."])
        ]),

        criarBloco(5, 2, "Aproveitar melhor", [
            criarPergunta(169, "reaproveitamento", "Seu lápis está sem ponta, mas ainda está bom. O que fazer?",
                ["Comprar outro imediatamente.", "Guardar sem usar nunca mais.", "Jogar fora.", "Apontar com cuidado e continuar usando."], 3,
                ["O lápis que você tem ainda pode servir.", "Ele pode continuar ajudando nos desenhos e nas atividades.", "Estar sem ponta não significa que o lápis acabou.", "Um pequeno cuidado permite aproveitar o lápis por mais tempo."]),

            criarPergunta(170, "consumo", "A escola tem a régua que a turma precisa. O que fazer?",
                ["Pedir emprestada, cuidar e devolver.", "Pegar escondido e ficar com ela.", "Deixar de fazer a atividade.", "Comprar várias iguais sem precisar."], 0,
                ["Compartilhar com cuidado aproveita um material que já existe.", "Precisamos pedir autorização e devolver o que pegamos.", "A turma pode buscar uma forma de usar o material disponível.", "Antes de comprar, vale aproveitar o que já está disponível."]),

            criarPergunta(171, "reaproveitamento", "Qual exemplo mostra a reciclagem do papel?",
                ["Usar o verso para desenhar.", "Emprestar um livro.", "Guardar folhas numa pasta.", "Transformar papel usado em papel novo."], 3,
                ["Isso é usar a folha de novo, sem transformar o material.", "Emprestar prolonga o uso do livro, mas não transforma o papel.", "Guardar organiza as folhas, mas não transforma o material.", "Na reciclagem, o material usado é transformado para ter um novo uso."]),

            criarPergunta(172, "consumo", "Antes de comprar material para um trabalho, o que conferir?",
                ["Só a embalagem mais bonita.", "O que já temos e podemos usar.", "Só o que o colega comprou.", "Quantas coisas cabem no carrinho."], 1,
                ["Uma embalagem bonita não mostra o que você realmente precisa.", "Conferir evita comprar de novo algo que já está disponível.", "O colega pode precisar de materiais diferentes dos seus.", "Caber no carrinho não significa que o material é necessário."]),

            criarPergunta(173, "reaproveitamento", "Sua garrafa rachou e pode machucar. O que fazer?",
                ["Pedir ajuda a um adulto.", "Dar a alguém sem contar do defeito.", "Continuar usando mesmo machucando.", "Esconder a rachadura."], 0,
                ["O adulto pode avaliar a troca e o destino da garrafa.", "A outra pessoa também pode se machucar.", "Usar de novo só é uma boa ideia quando o objeto é seguro.", "Esconder não resolve o risco de machucar."])
        ]),

        criarBloco(5, 3, "Energia para todos os dias", [
            criarPergunta(177, "agua", "Qual cuidado ter ao usar o bebedouro?",
                ["Encostar a boca na saída de água.", "Deixar a água correr depois de beber.", "Beber sem encostar a boca e parar a água depois.", "Ficar com sede para economizar."], 2,
                ["Evitar esse contato ajuda a manter a saída de água limpa.", "Depois de beber, a água não precisa continuar correndo.", "Assim, cuidamos da limpeza e evitamos água correndo sem uso.", "Economizar não significa deixar de beber a água necessária."]),

            criarPergunta(178, "consumo", "Na etiqueta de energia da geladeira, o adulto pode conferir o quê?",
                ["Quanto ela gasta de energia.", "Qual comida você mais gosta.", "Quantas pessoas visitarão a casa.", "Qual será a cor da cozinha."], 0,
                ["Essa informação ajuda a comparar o uso de energia dos aparelhos.", "A etiqueta de energia não mostra gostos pessoais.", "A etiqueta não prevê as visitas da família.", "A cor da cozinha não é uma informação sobre gasto de energia."]),

            criarPergunta(179, "agua", "Começou a época de chuva. Qual cuidado deve continuar?",
                ["Regar a terra já encharcada.", "Esquecer as torneiras pingando.", "Conferir se as torneiras ficaram fechadas.", "Deixar a água correr mais."], 2,
                ["Terra encharcada já tem muita água.", "Uma torneira pingando continua perdendo água mesmo com chuva.", "O cuidado com a água continua importante em qualquer época.", "A chuva não torna necessário gastar mais água à toa."]),

            criarPergunta(180, "agua", "Como economizar água e continuar se cuidando?",
                ["Evitar desperdício e manter a higiene.", "Parar de beber água.", "Deixar de lavar as mãos.", "Beber qualquer água encontrada na rua."], 0,
                ["Beber água e manter a higiene continuam sendo importantes.", "Seu corpo continua precisando de água.", "Lavar as mãos é um cuidado que deve continuar.", "A água da rua pode não ser segura para beber."]),

            criarPergunta(181, "consumo", "O dia esfriou e ninguém precisa do ventilador. O que fazer?",
                ["Deixar ligado por costume.", "Aumentar a velocidade.", "Colocar numa sala vazia ligado.", "Desligar pelo botão."], 3,
                ["Um costume pode ser revisto quando o aparelho não é necessário.", "Aumentar a velocidade não resolve o uso sem necessidade.", "Uma sala vazia pode continuar com o aparelho ligado à toa.", "O ventilador pode voltar a ser ligado quando for necessário."])
        ]),

        criarBloco(5, 4, "Pensar antes de agir", [
            criarPergunta(185, "energia", "Suas mãos estão molhadas e você precisa ligar um aparelho. O que fazer?",
                ["Mexer na tomada bem rápido.", "Secar a tomada com a mão.", "Puxar o fio do aparelho.", "Ficar longe da tomada e pedir ajuda."], 3,
                ["Fazer rápido não elimina o risco de choque.", "Não toque em partes elétricas molhadas.", "Puxar fios pode danificar o aparelho e causar acidentes.", "Peça a um adulto para ajudar com a ligação do aparelho."]),

            criarPergunta(186, "fontes", "Você viu folhas no painel solar do telhado. Como ajudar?",
                ["Subir numa cadeira para alcançar.", "Contar a um adulto sem subir.", "Subir no telhado sozinho.", "Puxar os fios do painel."], 1,
                ["Tentar alcançar o telhado pode causar uma queda.", "O adulto pode procurar alguém preparado para verificar o painel.", "Telhados são lugares perigosos para uma criança subir.", "Fios e painéis precisam de cuidados de pessoas preparadas."]),

            criarPergunta(187, "sustentabilidade", "Você viu um desperdício que não sabe resolver. O que fazer?",
                ["Esconder o que aconteceu.", "Desistir de todos os cuidados.", "Explicar a situação a um adulto.", "Achar que precisa resolver tudo sozinho."], 2,
                ["Esconder dificulta que alguém ajude a resolver.", "Você ainda pode ajudar com outras pequenas atitudes.", "Pedir ajuda também é uma forma de cuidar.", "Você pode contar com adultos para resolver problemas difíceis."]),

            criarPergunta(188, "consumo", "Uma luz ajuda as pessoas a andar num caminho escuro. O que considerar?",
                ["Só a cor da lâmpada.", "Só quem quer apagar primeiro.", "Se as pessoas precisam dela para enxergar.", "Só que toda luz acesa é desperdício."], 2,
                ["A cor sozinha não mostra se o caminho está seguro.", "A segurança das pessoas vem antes de uma disputa.", "Algumas luzes precisam ficar acesas para manter o caminho seguro.", "Uma luz necessária não é o mesmo que uma luz sem uso."]),

            criarPergunta(189, "agua", "Como cuidar da água do seu animal de estimação?",
                ["Deixar o pote vazio por horas.", "Manter água limpa disponível, com ajuda de um adulto.", "Oferecer água usada na limpeza.", "Dar água só quando alguém lembrar."], 1,
                ["O animal pode precisar beber durante esse tempo.", "O animal precisa de água adequada. Economize evitando desperdício na limpeza.", "Água de limpeza pode ter sujeira ou produtos que fazem mal.", "O animal precisa ter água disponível quando sentir sede."])
        ]),

        criarBloco(5, 5, "Missão da energia", [
            criarPergunta(193, "sustentabilidade", "Qual plano cuida da água e da energia?",
                ["Fechar a torneira e deixar a TV sem uso ligada.", "Apagar a luz e deixar a torneira aberta.", "Fazer cartazes e ignorar vazamentos.", "Avisar sobre vazamentos e apagar luzes sem uso."], 3,
                ["A torneira foi cuidada, mas a televisão continua gastando à toa.", "A luz foi cuidada, mas a água continua correndo sem uso.", "Os cartazes não resolvem sozinhos os vazamentos.", "Essas duas atitudes ajudam a evitar desperdício de água e energia."]),

            criarPergunta(194, "reaproveitamento", "A turma vai montar um jogo. Qual material pode aproveitar?",
                ["Papelão limpo, com ajuda adulta para cortar.", "Embalagens sujas de produtos de limpeza.", "Caixas com pedaços que cortam.", "Papel molhado e estragado."], 0,
                ["Um material seguro pode ganhar uma nova função na brincadeira.", "Restos de produtos de limpeza podem fazer mal.", "Partes cortantes podem machucar durante a brincadeira.", "Papel estragado pode não servir para montar o jogo."]),

            criarPergunta(195, "agua", "Para ser um detetive da água, o que observar?",
                ["Colegas para culpar.", "Torneiras abertas ou pingando sem uso.", "Brinquedos para levar embora.", "Paredes para pintar."], 1,
                ["A missão é encontrar cuidados possíveis, sem culpar pessoas.", "Essas pistas podem mostrar desperdício. Conte a um adulto.", "Levar brinquedos não ajuda a observar o uso da água.", "A pintura não mostra se as torneiras estão desperdiçando água."]),

            criarPergunta(196, "sustentabilidade", "A turma cuidou bem da água nesta semana. E depois?",
                ["Gastar mais para compensar.", "Continuar o hábito e aprender outro cuidado.", "Parar de cuidar porque a semana acabou.", "Ficar só na promessa."], 1,
                ["Gastar mais depois desfaz parte do cuidado que foi aprendido.", "Os bons hábitos podem continuar e crescer aos poucos.", "A água precisa de cuidado nas próximas semanas também.", "Praticar o cuidado é o que transforma a ideia em ação."]),

            criarPergunta(197, "sustentabilidade", "Quem deve ajudar a cuidar da natureza?",
                ["Crianças e adultos, cada um fazendo sua parte.", "Só quem mora perto de um rio.", "Só quem tem painéis solares.", "Somente as crianças."], 0,
                ["Todos podem ajudar. Crianças não precisam resolver tudo sozinhas.", "Mesmo longe dos rios, as pessoas precisam cuidar da natureza.", "Ter painéis solares não é necessário para começar a cuidar.", "Os adultos também têm responsabilidade pelo cuidado com a natureza."])
        ])
    ]
});

module.exports = trilhaFacil;