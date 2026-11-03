"use strict";

// correta: 0 = A, 1 = B, 2 = C, 3 = D.
// Os identificadores antigos foram preservados, inclusive os intervalos na numeração.

const categorias = {
    sustentabilidade: "🌱 SUSTENTABILIDADE",
    agua: "💧 CUIDADO COM A ÁGUA",
    energia: "⚡ ENERGIA NO DIA A DIA",
    consumo: "💡 USO CONSCIENTE",
    reaproveitamento: "♻️ REAPROVEITAMENTO",
    fontes: "☀️ FONTES DE ENERGIA"
};

function criarPergunta(numero, tema, pergunta, alternativas, correta, explicacao) {
    return {
        id: "facil_p" + String(numero).padStart(3, "0") + "_v1",
        tema,
        categoria: categorias[tema],
        pergunta,
        alternativas,
        correta,
        explicacao
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

// MÓDULO 1: Descobrindo a energia
trilhaFacil.modulos.push({
    id: "facil_m01_v1",
    nome: "Descobrindo a energia",
    ordem: 1,
    introducao: "Vamos entender sustentabilidade e descobrir como cuidar da água e da energia.",
    blocos: [
        criarBloco(1, 1, "Primeiras descobertas", [
            criarPergunta(1, "sustentabilidade",
                "O que significa ser sustentável?",
                ["Usar os recursos sem pensar no que sobra.", "Cuidar da natureza só nos dias de passeio.", "Usar os recursos com cuidado, pensando no futuro.", "Guardar tudo, mesmo sem precisar."],
                2, "Ser sustentável é atender às nossas necessidades e cuidar dos recursos para quem vive agora e para quem virá depois."),
            criarPergunta(2, "sustentabilidade",
                "Por que devemos cuidar da água e da energia?",
                ["Porque seu uso depende de recursos da natureza.", "Porque a natureza repõe tudo na mesma hora.", "Porque só precisamos delas dentro de casa.", "Porque pagar a conta evita qualquer desperdício."],
                0, "A água e a produção de eletricidade dependem da natureza. Evitar desperdícios ajuda a cuidar desses recursos."),
            criarPergunta(3, "sustentabilidade",
                "Quem se beneficia quando cuidamos dos recursos naturais?",
                ["Somente as pessoas que moram no campo.", "As pessoas de hoje e as próximas gerações.", "Apenas os adultos que trabalham.", "Somente quem paga a conta de água."],
                1, "Os recursos são importantes para muitas pessoas. Cuidar deles hoje também ajuda quem vai precisar deles no futuro."),
            criarPergunta(4, "reaproveitamento",
                "O que significa reaproveitar um material?",
                ["Jogar fora um objeto depois de usar.", "Trocar um objeto usado por um novo.", "Comprar vários objetos para guardar.", "Usar novamente algo que já foi usado."],
                3, "Reaproveitar é usar algo outra vez, na mesma função ou em uma nova. Uma caixa limpa pode virar um porta-lápis."),
            criarPergunta(5, "sustentabilidade",
                "Qual atitude ajuda a cuidar da água e da energia?",
                ["Usar mais água quando a conta já foi paga.", "Usar a quantidade necessária em cada atividade.", "Economizar apenas quando falta água ou luz.", "Deixar os aparelhos ligados para usar depois."],
                1, "Precisamos de água e energia para viver bem. O cuidado está em usá-las quando necessário e evitar o desperdício.")
        ]),

        criarBloco(1, 2, "Energia em ação", [
            criarPergunta(9, "energia",
                "A televisão está ligada. Para que ela usa eletricidade?",
                ["Para mostrar imagens e produzir som.", "Para manter os alimentos frios.", "Para fazer o ar circular na sala.", "Para aquecer a água do banho."],
                0, "A televisão transforma energia elétrica em imagens e som. Por isso, ligada sem ninguém assistir, ela pode desperdiçar energia."),
            criarPergunta(10, "energia",
                "À noite, qual uso da lâmpada atende a uma necessidade?",
                ["Iluminar um quarto vazio até de manhã.", "Ficar acesa depois que todos saem.", "Iluminar a mesa enquanto alguém lê.", "Ficar acesa ao lado de uma janela bem iluminada."],
                2, "A iluminação ajuda a enxergar e a realizar atividades com segurança. Podemos apagá-la quando ela deixa de ser necessária."),
            criarPergunta(11, "energia",
                "Para que a geladeira usa eletricidade?",
                ["Para lavar os alimentos guardados.", "Para aquecer os alimentos do almoço.", "Para manter os alimentos frios.", "Para deixar os alimentos mais maduros."],
                2, "A geladeira retira calor de seu interior. O frio ajuda a conservar alimentos que precisam ficar refrigerados."),
            criarPergunta(12, "energia",
                "O ventilador está ligado. O que a eletricidade faz nele?",
                ["Faz as pás girarem sem o motor funcionar.", "Faz o motor girar as pás.", "Faz o ar virar frio como dentro da geladeira.", "Faz o aparelho fornecer eletricidade à casa."],
                1, "O motor usa eletricidade para girar as pás. Esse movimento faz o ar circular e pode ajudar a refrescar as pessoas."),
            criarPergunta(13, "energia",
                "Qual situação mostra um uso necessário de eletricidade?",
                ["Manter a televisão ligada numa sala vazia.", "Deixar o videogame ligado depois de brincar.", "Acender todas as luzes de dia sem precisar.", "Acender a luz para caminhar em um corredor escuro."],
                3, "Economizar não significa ficar sem segurança ou conforto. Usar luz em um lugar escuro pode ser necessário.")
        ]),

        criarBloco(1, 3, "Olhar e escutar", [
            criarPergunta(17, "agua",
                "A torneira está fechada, mas continua pingando. O que isso indica?",
                ["Pode haver um vazamento.", "A torneira está economizando água.", "A água está voltando para o rio.", "A água está sendo filtrada."],
                0, "Pingos contínuos podem desperdiçar bastante água ao longo do tempo. Avise um adulto para verificar a torneira."),
            criarPergunta(18, "consumo",
                "A luz da janela já ilumina bem a mesa. O que pode ser feito?",
                ["Usar essa claridade e apagar a lâmpada da mesa.", "Acender outra lâmpada para completar a luz.", "Fechar a cortina e acender mais lâmpadas.", "Deixar a lâmpada acesa por costume."],
                0, "Quando a claridade natural é suficiente, podemos aproveitar essa luz para reduzir o uso de iluminação elétrica."),
            criarPergunta(19, "consumo",
                "Há som de televisão na sala, mas ninguém está assistindo. O que fazer?",
                ["Abaixar o som e deixá-la ligada.", "Trocar de canal e sair da sala.", "Desligar a televisão.", "Apagar a luz e manter a televisão ligada."],
                2, "Mesmo com o volume baixo, a televisão ligada usa eletricidade. Desligá-la quando ninguém assiste evita esse uso sem necessidade."),
            criarPergunta(20, "agua",
                "Qual situação mostra água sendo usada para uma necessidade?",
                ["Deixar a mangueira aberta sem ninguém usar.", "Beber água quando sentimos sede.", "Manter a torneira aberta enquanto conversamos.", "Deixar um copo cheio transbordar."],
                1, "Beber água faz parte do cuidado com a saúde. Economizar é evitar desperdícios, não deixar de beber quando precisamos."),
            criarPergunta(21, "agua",
                "Um balde já está cheio e a torneira continua aberta. O que fazer?",
                ["Afastar o balde e deixar a água correr.", "Colocar outro balde sem fechar a torneira.", "Fechar a torneira para parar o transbordamento.", "Esperar a água cair pelo chão."],
                2, "Depois que o recipiente enche, a água extra transborda. Fechar a torneira no momento certo evita esse desperdício.")
        ]),

        criarBloco(1, 4, "De onde vem?", [
            criarPergunta(25, "agua",
                "Em uma casa com rede de abastecimento, de onde vem a água da torneira?",
                ["Do fio que leva eletricidade à casa.", "Do ralo, que devolve a água usada.", "Da própria torneira, que fabrica água.", "De um sistema que capta, trata e distribui água."],
                3, "A água passa por etapas antes de chegar a muitas casas. Ela é retirada de uma fonte, tratada e levada por tubulações."),
            criarPergunta(26, "agua",
                "Por que a água destinada a beber precisa ser segura?",
                ["Porque pode ter sujeira e micróbios que fazem mal.", "Porque toda água transparente já pode ser bebida.", "Porque deixar a água no Sol resolve qualquer problema.", "Porque a cor da garrafa garante a qualidade."],
                0, "Nem tudo que pode fazer mal é visível. Beba água de uma fonte própria para consumo, conforme a orientação de um adulto."),
            criarPergunta(27, "energia",
                "Na rede elétrica, o que leva eletricidade até as casas?",
                ["Os fios e cabos da rede.", "Os canos que levam o esgoto.", "As nuvens que passam sobre o telhado.", "Os canos de água da cozinha."],
                0, "Fios e cabos fazem parte do caminho da eletricidade até os lugares onde ela é usada. Não devemos tocar nos fios da rede."),
            criarPergunta(28, "fontes",
                "Qual recurso um painel solar usa para produzir eletricidade?",
                ["A água guardada em um tanque.", "A luz do Sol.", "O movimento de um rio.", "A força do vento."],
                1, "Alguns painéis solares transformam a luz do Sol em eletricidade. Eles podem funcionar em telhados ou em outros locais adequados."),
            criarPergunta(29, "energia",
                "Qual é a função da tomada em uma casa?",
                ["Transformar água em eletricidade.", "Guardar toda a energia do aparelho.", "Criar eletricidade dentro da parede.", "Ligar um aparelho à instalação elétrica."],
                3, "A tomada é um ponto de ligação com a instalação elétrica, não uma fábrica de energia. Peça ajuda a um adulto para conectar aparelhos.")
        ]),

        criarBloco(1, 5, "Ligando as ideias", [
            criarPergunta(33, "consumo",
                "Qual frase explica melhor o que é evitar desperdícios?",
                ["Usar o necessário, sem gastar à toa.", "Trocar todos os objetos por novos.", "Parar de usar água para qualquer atividade.", "Deixar de usar luz mesmo quando está escuro."],
                0, "Podemos atender às nossas necessidades e, ao mesmo tempo, evitar usos desnecessários de água, energia e materiais."),
            criarPergunta(34, "agua",
                "Economizar água significa deixar de lavar as mãos?",
                ["Não. Precisamos deixar a torneira aberta o tempo todo.", "Sim. O melhor é lavar as mãos só com água da chuva.", "Sim. As mãos devem ser lavadas só uma vez por dia.", "Não. Podemos lavar bem e fechar a torneira ao ensaboar."],
                3, "Lavar as mãos é importante para a saúde. Fechar a torneira enquanto ensaboamos evita desperdício sem abandonar esse cuidado."),
            criarPergunta(35, "energia",
                "Qual atividade pode usar água e eletricidade ao mesmo tempo?",
                ["Brincar de bola no pátio durante o dia.", "Tomar banho com um chuveiro elétrico ligado.", "Desenhar com lápis em uma folha.", "Ler um livro perto de uma janela."],
                1, "O chuveiro elétrico usa água para o banho e eletricidade para aquecê-la. Evitar um banho demorado pode reduzir os dois usos."),
            criarPergunta(36, "reaproveitamento",
                "Uma folha foi usada de um lado e está limpa do outro. O que fazer?",
                ["Guardar a folha e nunca mais utilizá-la.", "Descartar a folha por ter uma marca.", "Pegar uma folha nova para todo rascunho.", "Usar o lado limpo para um rascunho."],
                3, "Usar o verso aproveita melhor o papel que já temos. Assim, menos folhas novas são necessárias para a mesma atividade."),
            criarPergunta(37, "sustentabilidade",
                "Como uma turma pode cuidar melhor dos recursos?",
                ["Cuidando só no dia de uma apresentação.", "Esperando apenas uma pessoa resolver tudo.", "Combinando pequenas atitudes e praticando todos os dias.", "Economizando na escola e desperdiçando em casa."],
                2, "Hábitos feitos em conjunto ajudam a evitar desperdícios. Cada pessoa pode participar com ações adequadas à sua idade.")
        ])
    ]
});

// MÓDULO 2: Energia em casa e na escola
trilhaFacil.modulos.push({
    id: "facil_m02_v1",
    nome: "Energia em casa e na escola",
    ordem: 2,
    introducao: "Vamos praticar cuidados com a água e a energia em casa e na escola.",
    blocos: [
        criarBloco(2, 1, "Uma casa cheia de energia", [
            criarPergunta(41, "consumo",
                "Todos estão lendo juntos na sala. Como iluminar esse espaço?",
                ["Usar várias lâmpadas mesmo se uma já ilumina bem.", "Usar a iluminação suficiente para todos lerem bem.", "Acender também as luzes dos quartos vazios.", "Apagar tudo, mesmo que ninguém consiga enxergar."],
                1, "O importante é ter luz suficiente para a atividade. Iluminar espaços vazios sem necessidade aumenta o consumo."),
            criarPergunta(42, "consumo",
                "O ar-condicionado está funcionando. Qual cuidado ajuda a evitar desperdício?",
                ["Manter portas e janelas fechadas durante esse uso.", "Colocar a menor temperatura mesmo sentindo frio.", "Deixar a porta aberta para o ar frio sair.", "Abrir as janelas para o aparelho esfriar a rua."],
                0, "Com portas e janelas abertas, mais ar quente pode entrar. Isso pode fazer o aparelho trabalhar mais para refrescar o ambiente."),
            criarPergunta(43, "consumo",
                "Antes de abrir a geladeira para o lanche, qual atitude ajuda?",
                ["Abrir e ficar escolhendo com a porta aberta.", "Deixar a porta aberta enquanto prepara a mesa.", "Pensar no que vai pegar e depois abrir.", "Abrir várias vezes para olhar as mesmas coisas."],
                2, "Decidir antes de abrir reduz o tempo com a porta aberta. Assim, entra menos calor e a geladeira precisa retirar menos desse calor."),
            criarPergunta(44, "consumo",
                "Qual combinação ajuda a usar bem a máquina de lavar roupas?",
                ["Lavar uma única meia a cada lavagem.", "Um adulto juntar roupas compatíveis, respeitando o limite.", "Encher a máquina além do limite indicado.", "Lavar de novo roupas que já estão limpas."],
                1, "Organizar as lavagens ajuda a aproveitar água e energia. Um adulto deve seguir as orientações da máquina e das roupas."),
            criarPergunta(45, "energia",
                "Está claro e há vento agradável entrando pela janela. O que pode refrescar a sala?",
                ["Fechar a janela e ligar aparelhos por costume.", "Ligar vários ventiladores sem avaliar a necessidade.", "Aproveitar a ventilação natural, se for segura e suficiente.", "Ligar o ar-condicionado e manter a janela aberta."],
                2, "Em algumas situações, a circulação natural do ar já oferece conforto. Assim, um aparelho pode não ser necessário.")
        ]),

        criarBloco(2, 2, "Aprender com a rotina", [
            criarPergunta(49, "agua",
                "Durante a escovação dos dentes, quando a torneira pode ficar fechada?",
                ["Enquanto escovamos, entre os momentos de usar água.", "Nunca, porque a água precisa correr durante a escovação.", "Apenas depois de sair do banheiro.", "Somente quando outra pessoa está olhando."],
                0, "A água não precisa correr enquanto a escova limpa os dentes. Abra a torneira quando precisar e feche depois."),
            criarPergunta(50, "agua",
                "Qual hábito evita desperdício durante o banho?",
                ["Continuar no banho só para a água ficar correndo.", "Deixar o chuveiro aberto antes de separar a toalha.", "Ficar com a água correndo enquanto brinca.", "Terminar o banho após fazer a higiene necessária."],
                3, "Podemos tomar um banho cuidadoso sem prolongar o tempo sem necessidade. Separar a toalha antes também ajuda na organização."),
            criarPergunta(51, "agua",
                "Antes de regar uma planta, o que vale observar com ajuda de um adulto?",
                ["Se ainda há água sobrando no regador.", "Se chegou a hora marcada, sem observar a terra.", "Se a terra já está úmida e se a planta precisa de água.", "Se ainda cabe mais água no prato do vaso."],
                2, "As plantas têm necessidades diferentes. Observar a umidade da terra ajuda a evitar regar sem necessidade ou em excesso."),
            criarPergunta(52, "agua",
                "Na hora de lavar a louça, qual hábito evita água correndo à toa?",
                ["Deixar a água correr enquanto guarda os pratos.", "Fechar a torneira enquanto ensaboa.", "Manter a torneira aberta enquanto pega o sabão.", "Usar água corrente para retirar cada resto de comida."],
                1, "A torneira pode ficar fechada em etapas que não precisam de água corrente. A limpeza continua sendo feita, com menos desperdício."),
            criarPergunta(53, "agua",
                "Você quer beber água, mas não sabe quanto vai tomar. O que fazer?",
                ["Beber menos que precisa para economizar.", "Encher vários copos antes de começar.", "Colocar um pouco e servir mais se ainda tiver sede.", "Encher até transbordar para garantir."],
                2, "Servir aos poucos pode evitar sobras no copo. Continue bebendo a quantidade de que precisa para cuidar da saúde.")
        ]),

        criarBloco(2, 3, "Pequenas escolhas", [
            criarPergunta(57, "reaproveitamento",
                "Qual cuidado ajuda a usar uma garrafa reutilizável por mais tempo?",
                ["Usar por vários dias sem fazer a limpeza.", "Trocar por uma nova sempre que mudar de passeio.", "Jogar a garrafa fora depois de cada uso.", "Lavar corretamente e usar a própria garrafa novamente."],
                3, "Uma garrafa adequada para reutilização pode ser usada muitas vezes. Ela precisa de limpeza e cuidados para continuar segura."),
            criarPergunta(58, "agua",
                "Na escola, a próxima pessoa ainda está longe da pia. O que fazer ao terminar?",
                ["Abrir mais a torneira para a próxima pessoa.", "Esperar o próximo aluno chegar sem fechar.", "Deixar a torneira aberta para adiantar.", "Fechar a torneira antes de sair."],
                3, "Entre um uso e outro, a água não precisa ficar correndo. Cada pessoa pode abrir a torneira quando chegar a sua vez."),
            criarPergunta(59, "consumo",
                "A turma vai ao pátio e a sala ficará vazia. O que combinar com o professor?",
                ["Deixar tudo ligado porque a turma vai voltar.", "Apagar as luzes que não precisam ficar acesas.", "Fechar a porta e esquecer os aparelhos ligados.", "Acender mais luzes para guardar o lugar."],
                1, "Combinar os cuidados com o professor ajuda a verificar o que pode ser desligado com segurança quando a sala fica vazia."),
            criarPergunta(60, "consumo",
                "A atividade no tablet terminou. Qual atitude ajuda a poupar a bateria?",
                ["Apagar a tela ou desligar, conforme a orientação do adulto.", "Aumentar o brilho antes de guardar.", "Deixar um vídeo passando enquanto ninguém usa.", "Abrir um jogo e deixar o aparelho parado."],
                0, "A tela e os aplicativos em uso consomem energia da bateria. Encerrar a atividade e apagar a tela evita consumo desnecessário."),
            criarPergunta(61, "agua",
                "Há folhas secas na calçada. Qual escolha evita usar água nessa limpeza?",
                ["Pedir que sejam recolhidas com uma vassoura.", "Empurrar as folhas com uma mangueira aberta.", "Jogar baldes de água até as folhas saírem.", "Deixar a água correr até limpar sozinha."],
                0, "Uma vassoura pode recolher folhas e sujeiras soltas sem água. A mangueira não precisa substituir esse cuidado.")
        ]),

        criarBloco(2, 4, "Cada coisa tem seu jeito", [
            criarPergunta(65, "energia",
                "A família vai sair por algumas horas. O que fazer com a geladeira que guarda alimentos?",
                ["Mantê-la funcionando para conservar os alimentos.", "Desligá-la junto com todas as luzes.", "Retirar os alimentos e desligar por costume.", "Deixar a porta aberta para entrar ar."],
                0, "Alguns aparelhos precisam continuar funcionando. A geladeira mantém a temperatura adequada para conservar os alimentos."),
            criarPergunta(66, "energia",
                "Um aparelho parece desligado, mas mantém uma luz acesa. O que pode acontecer?",
                ["Ele passa a produzir eletricidade para a casa.", "Ele ainda pode usar um pouco de eletricidade.", "Ele deixa de precisar de qualquer fonte de energia.", "A luz prova que o consumo é sempre zero."],
                1, "Alguns aparelhos ficam em modo de espera e ainda consomem energia. Um adulto pode conferir como desligá-los corretamente."),
            criarPergunta(67, "consumo",
                "Duas lâmpadas iluminam igualmente. Qual usa a energia de forma mais eficiente?",
                ["A que fica ligada por mais horas sem necessidade.", "A que tem a embalagem de maior tamanho.", "A que usa mais eletricidade para a mesma luz.", "A que fornece essa luz usando menos eletricidade."],
                3, "Ser eficiente é atender à mesma necessidade usando menos energia. Na compra de uma lâmpada, um adulto pode comparar essas informações."),
            criarPergunta(68, "consumo",
                "Um adulto vai aquecer água para uma bebida. Qual cuidado evita desperdício?",
                ["Aquecer água mesmo sem preparar a bebida.", "Reaquecer a água várias vezes sem precisar.", "Aquecer a quantidade necessária para o preparo.", "Aquecer uma panela cheia para usar só um pouco."],
                2, "Aquecer mais água do que o necessário pode gastar energia à toa. O preparo com água quente deve ficar com um adulto."),
            criarPergunta(69, "agua",
                "O chuveiro está sem aquecimento. Ainda é importante evitar um banho demorado?",
                ["Não, porque só a água quente vem da natureza.", "Sim, porque a água continua sendo usada.", "Sim, porque a água fria custa sempre mais que a quente.", "Não, porque água fria não precisa ser economizada."],
                1, "Mesmo sem aquecimento elétrico, o banho usa água. Cuidar do tempo continua ajudando a evitar desperdício.")
        ]),

        criarBloco(2, 5, "Cuidar e aproveitar", [
            criarPergunta(73, "agua",
                "Você viu água saindo de um cano da escola. Qual é a melhor atitude?",
                ["Esperar vários dias para ver se para.", "Avisar um professor e mostrar o local.", "Cobrir a água com papel e não avisar.", "Tentar desmontar o cano sem ajuda."],
                1, "Um adulto pode pedir o conserto e proteger o local. Avisar ajuda a resolver o vazamento sem colocar a criança em risco."),
            criarPergunta(74, "energia",
                "Um carregador está com o fio descascado. O que fazer?",
                ["Usar assim mesmo se ainda carregar.", "Puxar o fio para tentar encaixá-lo melhor.", "Cobrir com a mão enquanto carrega.", "Parar de usar e avisar um adulto, sem tocar na parte danificada."],
                3, "Fios danificados podem causar choque ou incêndio. A avaliação e a troca devem ser feitas por um adulto responsável."),
            criarPergunta(75, "reaproveitamento",
                "Uma camiseta limpa ficou pequena e ainda está boa. O que fazer com ajuda da família?",
                ["Doar para alguém que possa usá-la.", "Jogar fora só porque deixou de servir.", "Comprar outra igual e descartar as duas.", "Guardar molhada até estragar."],
                0, "Uma roupa em boas condições pode continuar útil para outra pessoa. Isso aproveita melhor os materiais usados na sua produção."),
            criarPergunta(76, "reaproveitamento",
                "A turma precisa de caixas para organizar os lápis. Qual opção aproveita materiais?",
                ["Usar caixas sujas sem nenhum cuidado.", "Comprar caixas novas mesmo tendo outras adequadas.", "Descartar as caixas boas e procurar outras iguais.", "Reutilizar caixas limpas, firmes e seguras."],
                3, "Um objeto que já existe pode atender a uma nova necessidade. Antes de reutilizar, é preciso verificar a limpeza e a segurança."),
            criarPergunta(77, "consumo",
                "Como evitar que um livro estrague antes do tempo?",
                ["Dobrar as páginas sempre que parar de ler.", "Jogar na mochila sem cuidar da capa.", "Manusear com cuidado e guardar em local seco.", "Deixar o livro perto de uma torneira aberta."],
                2, "Cuidar dos objetos aumenta seu tempo de uso. Isso pode evitar substituições e aproveitar melhor os materiais já produzidos.")
        ])
    ]
});

// MÓDULO 3: A natureza também ajuda
trilhaFacil.modulos.push({
    id: "facil_m03_v1",
    nome: "A natureza também ajuda",
    ordem: 3,
    introducao: "Vamos conhecer o Sol, o vento e a água e entender por que esses recursos precisam de cuidado.",
    blocos: [
        criarBloco(3, 1, "Fontes para descobrir", [
            criarPergunta(81, "fontes",
                "O que faz girar as pás de um gerador de energia do vento?",
                ["O vento que passa pelas pás.", "O calor de uma lâmpada próxima.", "A luz refletida pela pintura.", "A água guardada debaixo da torre."],
                0, "O vento movimenta as pás de equipamentos próprios para isso. Esse movimento pode ser usado para produzir eletricidade."),
            criarPergunta(82, "fontes",
                "Uma usina hidrelétrica usa principalmente qual recurso para gerar eletricidade?",
                ["O movimento da água.", "A luz do Sol.", "O movimento do vento.", "O calor de uma fogueira."],
                0, "Em uma hidrelétrica, a água em movimento gira equipamentos ligados a geradores. Assim, parte dessa energia se transforma em eletricidade."),
            criarPergunta(83, "fontes",
                "O que significa dizer que uma fonte de energia é renovável?",
                ["Que ela está disponível do mesmo jeito o tempo todo.", "Que qualquer aparelho pode fabricar essa fonte.", "Que seu uso nunca causa impactos na natureza.", "Que ela se renova por processos da natureza."],
                3, "Fontes como o Sol e o vento se renovam na natureza. Mesmo assim, sua disponibilidade varia e seu aproveitamento exige cuidados."),
            criarPergunta(84, "fontes",
                "Qual atividade aproveita diretamente o calor do Sol?",
                ["Guardar uma fruta na geladeira.", "Ligar uma televisão na tomada.", "Secar uma toalha no varal ao Sol.", "Acender uma lâmpada durante a noite."],
                2, "O calor do Sol ajuda a água da toalha a evaporar. O vento também pode colaborar para a secagem."),
            criarPergunta(85, "fontes",
                "Qual destes é uma fonte natural de energia?",
                ["O carregador.", "O vento.", "A tomada.", "O interruptor."],
                1, "O vento existe na natureza e pode fornecer energia. Tomadas, interruptores e carregadores são equipamentos usados nas instalações elétricas.")
        ]),

        criarBloco(3, 2, "Natureza em movimento", [
            criarPergunta(89, "agua",
                "Uma roupa molhada seca no varal. O que acontece com parte da água?",
                ["Passa para o ar como vapor.", "Fica toda presa no tecido seco.", "Desaparece sem continuar em outro lugar.", "É toda absorvida pelos pregadores."],
                0, "A água pode passar do estado líquido para o vapor. Esse processo se chama evaporação e ajuda a explicar a secagem."),
            criarPergunta(90, "agua",
                "Depois de um dia quente, uma poça diminuiu. Qual explicação é possível?",
                ["Toda a água foi parar diretamente nas torneiras.", "A água foi transformada em poeira.", "Parte da água evaporou.", "Toda a água deixou de existir."],
                2, "O calor pode ajudar a água a evaporar e passar para o ar. Ela muda de estado, mas não deixa de existir."),
            criarPergunta(91, "agua",
                "Como a chuva pode ajudar no abastecimento de água?",
                ["Dispensa o tratamento da água que será bebida.", "Pode repor água em rios e reservatórios.", "Enche qualquer reservatório por completo em minutos.", "Transforma toda a água do mar em água potável."],
                1, "A chuva participa da reposição da água usada no abastecimento. A quantidade de chuva e outros cuidados influenciam essa disponibilidade."),
            criarPergunta(92, "fontes",
                "Depois de mover equipamentos de uma hidrelétrica, o que acontece com a água?",
                ["Ela se transforma toda em fios elétricos.", "Ela fica automaticamente própria para beber.", "Ela continua sendo água e pode seguir seu caminho.", "Ela desaparece ao produzir eletricidade."],
                2, "A hidrelétrica aproveita a energia do movimento da água. A água não se transforma em eletricidade nem fica limpa por esse processo."),
            criarPergunta(93, "agua",
                "Por que a água também é importante para as plantas?",
                ["Porque substitui toda a luz de que precisam.", "Porque participa do crescimento e da vida delas.", "Porque permite que qualquer planta viva submersa.", "Porque serve apenas para limpar suas folhas."],
                1, "As plantas precisam de água para viver. A quantidade adequada varia: água demais também pode prejudicar algumas plantas.")
        ]),

        criarBloco(3, 3, "Uma viagem pelas fontes", [
            criarPergunta(97, "fontes",
                "Um painel que produz eletricidade com a luz do Sol funciona igual à noite?",
                ["Não, porque ele só funciona quando faz muito calor.", "Não, porque não recebe a luz solar necessária.", "Sim, porque ele gera a mesma quantidade sem luz.", "Sim, porque uma bateria substitui a luz sobre o painel."],
                1, "Sem luz solar, esse painel não produz eletricidade. Uma casa pode usar energia guardada em baterias ou recebida da rede, se tiver esses sistemas."),
            criarPergunta(98, "fontes",
                "O vento parou em um parque de geradores. O que pode acontecer?",
                ["A produção aumenta porque as pás ficam em repouso.", "A produção fica igual, mesmo com as pás paradas.", "A produção depende só da altura da torre.", "A produção de eletricidade pelo vento diminui ou para."],
                3, "Esses geradores precisam do movimento do ar. Por isso, a quantidade de vento influencia a eletricidade que produzem."),
            criarPergunta(99, "fontes",
                "Uma região ficou muito tempo sem chuva. Como isso pode afetar uma hidrelétrica?",
                ["Pode haver menos água disponível para gerar eletricidade.", "A usina passa a funcionar igual mesmo sem água.", "A quantidade de água deixa de influenciar a geração.", "A água do reservatório aumenta sem receber chuva."],
                0, "A pouca chuva pode reduzir a água nos rios e reservatórios. Isso pode limitar a geração de eletricidade nessa usina."),
            criarPergunta(100, "fontes",
                "Usar fontes renováveis dispensa os cuidados com a natureza?",
                ["Sim. Qualquer equipamento renovável não ocupa espaço.", "Sim. Nenhum material é usado nesses equipamentos.", "Não. Construir e usar os equipamentos também exige cuidados.", "Não. Por isso, essas fontes nunca podem ser usadas."],
                2, "Fontes renováveis podem trazer benefícios, mas seus equipamentos usam materiais e espaço. É preciso planejar e reduzir impactos."),
            criarPergunta(101, "consumo",
                "Uma casa tem painéis solares. Como deve usar a eletricidade?",
                ["Deixar aparelhos ligados mesmo sem uso.", "Trocar o cuidado diário por consumo sem limite.", "Manter todas as lâmpadas acesas durante o dia.", "Atender às necessidades e continuar evitando desperdícios."],
                3, "Produzir eletricidade com o Sol não torna o desperdício uma boa escolha. A energia e os equipamentos devem ser bem aproveitados.")
        ]),

        criarBloco(3, 4, "Recursos ao nosso redor", [
            criarPergunta(105, "agua",
                "Por que a água do mar não deve ser bebida diretamente?",
                ["Porque toda água em movimento faz mal.", "Porque a água do mar só é segura à noite.", "Porque só a água morna pode ser bebida.", "Porque tem muito sal."],
                3, "A água do mar tem sal em quantidade inadequada para beber. Para a nossa saúde, precisamos de água própria para consumo."),
            criarPergunta(106, "agua",
                "Uma família guardou água usada na lavagem de roupas. Qual cuidado é essencial?",
                ["Misturar com suco para esconder o cheiro.", "Colocar na geladeira para torná-la potável.", "Não usar essa água para beber ou preparar alimentos.", "Servir essa água em copos se parecer transparente."],
                2, "Água usada pode conter sabão, sujeira e micróbios. Um adulto deve avaliar se há algum uso seguro; ela não é água para beber."),
            criarPergunta(107, "agua",
                "Um papel caiu perto de um rio durante um passeio. O que ajuda a proteger a água?",
                ["Empurrar o papel para a água levar.", "Recolher o papel, se for seguro, e colocá-lo em local adequado.", "Deixar no chão porque a chuva pode limpar.", "Esconder o papel entre as pedras da margem."],
                1, "O lixo pode chegar aos rios e prejudicar a água e os seres vivos. Recolha apenas objetos seguros e peça ajuda quando necessário."),
            criarPergunta(108, "agua",
                "Por que evitar jogar óleo de cozinha usado no ralo?",
                ["Porque pode causar entupimentos e poluir a água.", "Porque ele melhora a limpeza da água do rio.", "Porque ele se transforma rapidamente em água limpa.", "Porque ele conserta os canos por dentro."],
                0, "O óleo usado precisa de descarte adequado. Um adulto pode guardá-lo com segurança e procurar um ponto que receba esse material."),
            criarPergunta(109, "agua",
                "Além das pessoas, quem precisa de água para viver?",
                ["Apenas as plantas que ficam dentro de casa.", "Animais e plantas.", "Somente os animais que vivem no mar.", "Apenas os aparelhos elétricos."],
                1, "A água faz parte da vida de muitos seres vivos. Proteger rios e outras fontes também ajuda animais e plantas.")
        ]),

        criarBloco(3, 5, "Juntando as descobertas", [
            criarPergunta(113, "agua",
                "Há muita água no planeta. Por que isso não significa água pronta para beber em todo lugar?",
                ["Porque qualquer água pode ser bebida depois de agitada.", "Porque toda a água do planeta já sai tratada da natureza.", "Porque grande parte é salgada e a água disponível precisa de cuidados.", "Porque os rios fornecem água limpa sem nenhum limite."],
                2, "A água própria para consumo não está igualmente disponível em todos os lugares. Proteger as fontes, tratar e distribuir água são cuidados importantes."),
            criarPergunta(114, "sustentabilidade",
                "Cuidar de um rio ajuda apenas quem mora ao lado dele?",
                ["Sim. A água de um rio fica sempre no mesmo ponto.", "Sim. Só quem vê o rio pode usar sua água.", "Não. O cuidado com um rio substitui todos os outros cuidados.", "Não. O rio pode atender pessoas e seres vivos em vários lugares."],
                3, "A água segue caminhos e pode atender comunidades diferentes. A poluição e o cuidado com o rio podem ter efeitos além de um único lugar."),
            criarPergunta(115, "fontes",
                "Qual grupo reúne fontes renováveis de energia?",
                ["Lâmpada, televisão e geladeira.", "Tomada, extensão e carregador.", "Sol, vento e movimento da água.", "Interruptor, fio e controle remoto."],
                2, "Sol, vento e água em movimento podem fornecer energia. Os outros grupos são formados por aparelhos ou peças da instalação elétrica."),
            criarPergunta(116, "agua",
                "Choveu bastante hoje. Como deve ser o cuidado com a água amanhã?",
                ["Continuar evitando desperdícios.", "Deixar as torneiras abertas para gastar o excesso.", "Usar água sem pensar até voltar a faltar chuva.", "Parar de avisar sobre vazamentos."],
                0, "A chuva ajuda a repor a água, mas ela ainda precisa ser captada, tratada e distribuída. O cuidado deve fazer parte da rotina."),
            criarPergunta(117, "energia",
                "Por que economizar água tratada também pode ajudar a economizar energia?",
                ["Porque fechar a torneira recarrega os aparelhos.", "Porque a água dispensa tratamento quando é economizada.", "Porque água tratada chega às casas sem nenhum equipamento.", "Porque captar, tratar e levar água pode usar eletricidade."],
                3, "Bombas e equipamentos do abastecimento podem usar eletricidade. Evitar desperdício de água também evita trabalho desnecessário nesses sistemas.")
        ])
    ]
});

// MÓDULO 4: Brincando de cientista
trilhaFacil.modulos.push({
    id: "facil_m04_v1",
    nome: "Brincando de cientista",
    ordem: 4,
    introducao: "Vamos observar pistas, comparar situações e descobrir como evitar desperdícios.",
    blocos: [
        criarBloco(4, 1, "O que aconteceu?", [
            criarPergunta(121, "consumo",
                "Nuvens escureceram a sala e ficou difícil ler. O que faz sentido fazer?",
                ["Parar de estudar porque luz elétrica é sempre desperdício.", "Acender também as luzes de todas as salas vazias.", "Continuar no escuro para economizar a qualquer custo.", "Acender a iluminação necessária para ler bem."],
                3, "A necessidade de iluminação muda ao longo do dia. Economizar inclui ajustar o uso sem prejudicar a leitura e a segurança."),
            criarPergunta(122, "agua",
                "Apareceu uma mancha úmida na parede perto de um cano. O que fazer?",
                ["Afirmar que é um vazamento sem verificar.", "Avisar um adulto para investigar a causa.", "Pintar a mancha e não contar a ninguém.", "Abrir a parede para procurar o cano."],
                1, "Uma mancha pode ter diferentes causas, inclusive vazamento. Um adulto deve verificar antes de decidir como resolver."),
            criarPergunta(123, "agua",
                "Muito tempo após a descarga, a água continua correndo no vaso. O que isso pode indicar?",
                ["Um problema que precisa ser verificado por um adulto.", "Que a descarga está economizando mais água.", "Que toda descarga deve correr sem parar.", "Que o vaso precisa receber papel para parar."],
                0, "A água correndo continuamente pode indicar defeito na descarga. Avisar um adulto ajuda a identificar e resolver o desperdício."),
            criarPergunta(124, "fontes",
                "Duas roupas iguais foram penduradas molhadas. A que ficou ao Sol secou antes. O que pode explicar isso?",
                ["A roupa ao Sol deixou de ter tecido.", "A sombra produziu água dentro da outra roupa.", "O calor do Sol ajudou a água a evaporar.", "O pregador ao Sol absorveu toda a água."],
                2, "O calor pode acelerar a evaporação. O vento e a umidade do ar também influenciam a secagem das roupas."),
            criarPergunta(125, "reaproveitamento",
                "No lixo da sala há folhas com o verso limpo. Qual ideia pode reduzir esse descarte?",
                ["Comprar uma lixeira maior para jogar mais folhas.", "Proibir qualquer atividade que use papel.", "Criar uma caixa de folhas para rascunho.", "Usar uma folha nova em cada pequeno desenho."],
                2, "Separar folhas ainda aproveitáveis facilita usar o verso. Elas precisam estar limpas e não conter informações que devam ser protegidas.")
        ]),

        criarBloco(4, 2, "Observar e comparar", [
            criarPergunta(129, "agua",
                "Em um minuto, uma torneira encheu um copo e outra encheu dois iguais. Qual liberou mais água?",
                ["Não é possível comparar usando copos iguais.", "As duas liberaram a mesma quantidade.", "A que encheu um copo.", "A que encheu dois copos."],
                3, "Copos iguais permitem comparar a quantidade de água. No mesmo tempo, dois copos cheios representam mais água que um."),
            criarPergunta(130, "fontes",
                "Para comparar a secagem ao Sol e à sombra, como devem começar os dois panos?",
                ["Um de papel e outro de tecido grosso.", "Um grande e outro muito pequeno.", "Um seco e outro bem molhado.", "Com o mesmo tamanho, tecido e quantidade de água."],
                3, "Manter os panos parecidos ajuda a observar o efeito do local. Se muitas coisas mudam juntas, fica difícil saber o motivo da diferença."),
            criarPergunta(131, "energia",
                "O mesmo ventilador funciona na mesma velocidade por dez ou trinta minutos. Quando usa mais eletricidade?",
                ["Quando fica ligado por dez minutos.", "Quando fica ligado por trinta minutos.", "Não usa eletricidade se a velocidade não muda.", "Usa o mesmo, pois o tempo não interfere."],
                1, "Com o aparelho funcionando do mesmo jeito, mais tempo ligado significa mais energia usada. Por isso, o tempo de uso importa."),
            criarPergunta(132, "agua",
                "Dois copos iguais foram servidos. Um ficou vazio e o outro com água sobrando. O que observar na próxima vez?",
                ["Se vale servir menos e completar quando necessário.", "Se o copo com sobra deve ser maior.", "Se é melhor encher até transbordar.", "Se todos devem parar de beber água."],
                0, "Observar sobras ajuda a ajustar a quantidade servida. A pessoa pode pegar mais água sempre que precisar."),
            criarPergunta(133, "agua",
                "Duas crianças escovaram bem os dentes pelo mesmo tempo. Uma fechou a torneira ao escovar. Quem evitou mais desperdício?",
                ["As duas desperdiçaram igual porque usaram escova.", "A que fechou a torneira entre os usos.", "A que deixou a torneira aberta durante tudo.", "A que abriu mais a torneira durante a escovação."],
                1, "Fechar a torneira na etapa que não precisa de água corrente reduz esse uso. Isso não exige escovar por menos tempo.")
        ]),

        criarBloco(4, 3, "Fazer perguntas", [
            criarPergunta(137, "agua",
                "Uma planta parece murcha. Qual observação ajuda antes de colocar mais água?",
                ["Verificar com um adulto se a terra está seca ou úmida.", "Trocar de vaso sem observar a planta.", "Olhar apenas a cor do vaso.", "Colocar água até transbordar para testar."],
                0, "A aparência da planta, sozinha, não conta toda a história. Verificar a terra e conhecer a planta ajuda a decidir o cuidado adequado."),
            criarPergunta(138, "consumo",
                "Um ventilador está ligado em uma sala. Qual pergunta ajuda a decidir se ele é necessário?",
                ["Qual é a cor das pás do ventilador?", "Há alguém usando a sala e precisando se refrescar?", "O aparelho combina com a parede?", "Ele foi comprado em uma caixa grande?"],
                1, "Observar quem usa o ambiente e o conforto das pessoas ajuda a avaliar a necessidade. A aparência do aparelho não responde isso."),
            criarPergunta(139, "agua",
                "A conta de água ficou mais cara. Isso prova, sozinho, que houve desperdício?",
                ["Sim. Só vazamentos podem mudar uma conta.", "Não. O valor da conta nunca tem relação com o consumo.", "Sim. O valor prova que alguém deixou a torneira aberta.", "Não. É preciso conferir o consumo, o preço e possíveis causas."],
                3, "O valor pode mudar por consumo ou por preço, por exemplo. Um adulto pode analisar a conta e investigar antes de tirar conclusões."),
            criarPergunta(140, "consumo",
                "A turma quer saber se deixa luzes acesas em salas vazias. O que registrar com o professor?",
                ["Somente o tamanho da porta da sala.", "A cor favorita de cada aluno.", "Apenas a quantidade de cadeiras da escola.", "O local, o horário e se a sala estava sendo usada."],
                3, "Registros ligados à dúvida ajudam a encontrar padrões. Anotar onde e quando ocorre o desperdício facilita planejar uma solução."),
            criarPergunta(141, "agua",
                "Como relatar uma torneira pingando para um funcionário da escola?",
                ["Dizer onde ela fica e o que foi observado.", "Dizer apenas que toda a escola está com defeito.", "Escolher um colega para culpar sem saber.", "Esperar que ele encontre sozinho algum dia."],
                0, "Informações claras ajudam o responsável a localizar o problema. Não é preciso inventar a causa nem apontar culpados.")
        ]),

        criarBloco(4, 4, "Descobrir o motivo", [
            criarPergunta(145, "energia",
                "Por que deixar a geladeira aberta por muito tempo pode aumentar o consumo?",
                ["Porque abrir a porta desliga o resfriamento para sempre.", "Porque o ar de fora ajuda a gelar os alimentos.", "Porque a luz interna é responsável por todo o frio.", "Porque entra calor e ela precisa resfriar o interior novamente."],
                3, "A geladeira trabalha para manter o interior frio. Quando entra mais calor, ela precisa retirar esse calor para recuperar a temperatura."),
            criarPergunta(146, "agua",
                "Por que uma torneira que pinga merece atenção mesmo com gotas pequenas?",
                ["Porque colocar um copo embaixo já conserta o defeito.", "Porque as gotas se acumulam ao longo do tempo.", "Porque o tempo não muda a quantidade perdida.", "Porque só vazamentos grandes representam perda de água."],
                1, "Uma pequena perda repetida por muitas horas pode somar bastante água. Identificar e consertar vazamentos evita essa perda contínua."),
            criarPergunta(147, "consumo",
                "Por que abrir a cortina pode ajudar a economizar eletricidade durante o dia?",
                ["Porque uma lâmpada acesa não consome energia durante o dia.", "Porque pode entrar luz suficiente para dispensar uma lâmpada.", "Porque abrir a cortina desliga as lâmpadas automaticamente.", "Porque a luz natural diminui o consumo de qualquer aparelho."],
                1, "A luz natural pode atender à necessidade de iluminação. Isso depende do horário, do tempo e das condições do ambiente."),
            criarPergunta(148, "reaproveitamento",
                "Por que usar um caderno até aproveitar suas páginas ajuda a cuidar dos recursos?",
                ["Porque comprar outro sempre evita mais desperdício.", "Porque guardar sem usar é igual a aproveitar o caderno.", "Porque reduz a necessidade de substituir um material ainda útil.", "Porque reciclar dispensa aproveitar as páginas restantes."],
                2, "Produzir papel e cadernos usa materiais, água e energia. Aproveitar o que já temos ajuda a evitar produção e compras sem necessidade."),
            criarPergunta(149, "agua",
                "Por que um regador pode ajudar a cuidar da água ao regar uma planta?",
                ["Porque dispensa observar se a planta precisa de água.", "Porque transforma qualquer água em água potável.", "Porque ajuda a direcionar e controlar a quantidade usada.", "Porque impede que qualquer planta receba água demais."],
                2, "O regador ajuda a colocar água no lugar certo. Mesmo assim, é preciso observar a necessidade da planta e evitar excessos.")
        ]),

        criarBloco(4, 5, "Explicar com suas palavras", [
            criarPergunta(153, "consumo",
                "Após combinar apagar luzes desnecessárias, a turma encontrou menos salas vazias iluminadas. O que isso sugere?",
                ["Que o combinado pode estar ajudando.", "Que qualquer luz acesa agora é um erro.", "Que não é mais preciso observar a rotina.", "Que a escola nunca mais precisará de eletricidade."],
                0, "A mudança observada é um sinal de melhora. Continuar acompanhando ajuda a saber se o hábito está sendo mantido."),
            criarPergunta(154, "fontes",
                "Um painel solar produziu menos em um dia muito nublado. Qual explicação faz sentido?",
                ["O painel necessariamente quebrou ao receber sombra.", "Os dias nublados sempre aumentam a produção solar.", "A produção depende só do tamanho do painel.", "Menos luz solar pode ter chegado ao painel."],
                3, "Nuvens podem reduzir a luz que chega ao painel e diminuir a geração. Isso não significa que o painel esteja necessariamente quebrado."),
            criarPergunta(155, "agua",
                "Uma turma começou a fechar as torneiras entre os usos. Como acompanhar esse hábito?",
                ["Olhar uma única vez e encerrar o cuidado.", "Contar só quantas torneiras existem.", "Observar em vários dias e anotar o que acontece.", "Perguntar apenas se os alunos gostam de água."],
                2, "Observar mais de uma vez ajuda a perceber a rotina. Um único momento pode não mostrar o que acontece nos outros dias."),
            criarPergunta(156, "agua",
                "Você viu uma torneira fechada na escola. O que pode afirmar com certeza?",
                ["Que nenhuma torneira da escola tem vazamento.", "Que a escola deixou de usar água.", "Que aquela torneira estava fechada naquele momento.", "Que todas as pessoas da escola economizam sempre."],
                2, "Uma observação mostra uma parte da situação. Para falar sobre toda a escola, precisamos observar outros locais e momentos."),
            criarPergunta(157, "sustentabilidade",
                "Qual explicação ajuda um colega a entender o cuidado com os recursos?",
                ["Contar o que fazer e explicar como isso evita desperdício.", "Dizer apenas que ele está errado.", "Dar uma ordem sem deixar o colega perguntar.", "Inventar uma consequência para assustá-lo."],
                0, "Explicar os motivos ajuda as pessoas a compreender e participar. Podemos ensinar com respeito, sem humilhar ou assustar.")
        ])
    ]
});

// MÓDULO 5: Nossa missão de cuidar
trilhaFacil.modulos.push({
    id: "facil_m05_v1",
    nome: "Nossa missão de cuidar",
    ordem: 5,
    introducao: "Vamos transformar o que aprendemos em escolhas e hábitos para cuidar dos recursos.",
    blocos: [
        criarBloco(5, 1, "Escolhas que ajudam", [
            criarPergunta(161, "sustentabilidade",
                "A turma quer começar uma missão para evitar desperdícios. Qual é um bom primeiro passo?",
                ["Fazer um cartaz e não mudar nenhum hábito.", "Tentar resolver todos os problemas da cidade em um dia.", "Escolher um cuidado possível e combinar como praticá-lo.", "Esperar alguém de fora cuidar de tudo."],
                2, "Um objetivo claro ajuda a transformar a ideia em ação. A turma pode começar com um hábito simples e acompanhar como ele funciona."),
            criarPergunta(162, "agua",
                "A turma vê um vazamento enquanto prepara cartazes sobre economia de água. O que fazer primeiro?",
                ["Terminar todos os cartazes antes de contar a alguém.", "Colocar um cartaz sobre a poça e deixar assim.", "Avisar um adulto para que o vazamento seja verificado.", "Ignorar o problema porque a turma já está fazendo cartazes."],
                2, "Informar um problema real permite buscar uma solução. Os cartazes ajudam a ensinar, mas não substituem o conserto necessário."),
            criarPergunta(163, "sustentabilidade",
                "Qual tarefa é adequada para uma criança numa missão de cuidado com a escola?",
                ["Desmontar uma torneira sem orientação.", "Abrir a caixa de energia para procurar defeitos.", "Subir no telhado para examinar painéis solares.", "Observar desperdícios e avisar um adulto."],
                3, "A criança pode observar, aprender e comunicar. Consertos e tarefas com risco precisam de adultos preparados."),
            criarPergunta(164, "consumo",
                "Como organizar o cuidado com as luzes da sala ao sair?",
                ["Manter as luzes acesas para ninguém precisar verificar.", "Combinar com o professor quem verifica as luzes desnecessárias.", "Deixar a tarefa sem responsável e torcer para lembrar.", "Apagar qualquer luz da escola sem avisar."],
                1, "Um combinado claro facilita lembrar da tarefa. O professor pode orientar quais luzes podem ser apagadas com segurança."),
            criarPergunta(165, "sustentabilidade",
                "Um colega esqueceu a torneira aberta. Como ajudar?",
                ["Lembrá-lo com respeito e fechar a torneira, se for seguro.", "Dizer que só ele deve cuidar da água a partir de agora.", "Ridicularizar o colega na frente da turma.", "Deixar a água correr para que ele seja punido."],
                0, "Erros podem virar oportunidades de aprender. Agir com respeito ajuda a construir um cuidado que todos conseguem manter.")
        ]),

        criarBloco(5, 2, "Aproveitar melhor", [
            criarPergunta(169, "reaproveitamento",
                "Um lápis ficou sem ponta, mas ainda está bom para usar. O que fazer?",
                ["Comprar uma caixa nova antes de tentar apontar.", "Guardar sem uso e pegar sempre outro novo.", "Jogar fora porque a ponta acabou.", "Apontar com o cuidado adequado e continuar usando."],
                3, "Um pequeno cuidado pode manter o objeto útil. Aproveitar o lápis evita descartar um material que ainda serve."),
            criarPergunta(170, "consumo",
                "A turma usará uma régua grande só em uma atividade. A escola já tem uma. O que faz sentido?",
                ["Pedir emprestado, cuidar e devolver.", "Pegar sem avisar e não devolver.", "Cancelar a atividade para não usar nenhum material.", "Comprar uma igual para cada aluno sem precisar."],
                0, "Compartilhar objetos disponíveis pode atender à necessidade sem novas compras. Pedir autorização e devolver fazem parte desse cuidado."),
            criarPergunta(171, "reaproveitamento",
                "Qual situação é um exemplo de reciclagem?",
                ["Uma garrafa reutilizável ser lavada para usar de novo.", "Uma caixa limpa ser usada como porta-lápis.", "Um livro passar de uma pessoa para outra.", "Papel usado virar matéria-prima para produzir novo papel."],
                3, "Na reciclagem, o material é transformado para produzir novos materiais ou produtos. Reutilizar é aproveitar o objeto novamente."),
            criarPergunta(172, "consumo",
                "Antes de comprar material para um trabalho, qual atitude evita desperdício?",
                ["Comprar tudo em dobro antes de olhar os armários.", "Conferir o que já existe e fazer uma lista do necessário.", "Escolher só pela embalagem mais chamativa.", "Descartar os materiais antigos mesmo estando bons."],
                1, "Planejar a compra evita levar materiais repetidos ou sem uso. O que já temos pode atender a parte da atividade."),
            criarPergunta(173, "reaproveitamento",
                "Uma garrafa reutilizável está rachada e não pode ser usada com segurança. O que fazer?",
                ["Pedir a um adulto que avalie a troca e o descarte adequado.", "Doar a garrafa quebrada sem avisar do problema.", "Continuar usando mesmo que machuque ou vaze.", "Usar apenas na escola para esconder a rachadura."],
                0, "Reaproveitar também exige segurança. Quando um objeto deixa de ser adequado, um adulto pode orientar o destino correto.")
        ]),

        criarBloco(5, 3, "Energia para todos os dias", [
            criarPergunta(177, "agua",
                "No bebedouro, como cuidar da água e da higiene?",
                ["Encostar a boca na saída para não cair nenhuma gota.", "Deixar a água correndo após matar a sede.", "Beber sem encostar a boca na saída e encerrar o fluxo depois.", "Evitar beber água durante todo o período da aula."],
                2, "Precisamos beber água e cuidar da limpeza do ponto de saída. Depois de usar, verifique se a água parou de correr."),
            criarPergunta(178, "consumo",
                "A família precisa comprar uma geladeira. O que ajuda a escolher uma que use bem a energia?",
                ["Comparar o consumo de modelos que atendem à necessidade.", "Ignorar as informações de consumo do aparelho.", "Escolher apenas pela cor da porta.", "Comprar a maior, mesmo sem precisar de espaço."],
                0, "A etiqueta de energia ajuda os adultos a comparar aparelhos. O tamanho e as necessidades da família também entram na escolha."),
            criarPergunta(179, "agua",
                "Chegou a época de chuvas. Qual hábito deve continuar?",
                ["Regar toda planta mesmo com a terra encharcada.", "Parar de reparar vazamentos pequenos.", "Verificar se as torneiras ficaram bem fechadas.", "Deixar a água correr mais por haver chuva."],
                2, "A chuva não elimina os cuidados com a água tratada. Manter bons hábitos evita desperdícios em diferentes épocas do ano."),
            criarPergunta(180, "agua",
                "A família precisa reduzir o uso de água. Qual escolha preserva as necessidades básicas?",
                ["Evitar lavagens desnecessárias e manter a água para beber e a higiene.", "Deixar as pessoas beberem menos do que precisam.", "Parar de lavar as mãos antes de comer.", "Usar água de origem desconhecida para preparar alimentos."],
                0, "Beber, preparar alimentos e cuidar da higiene são necessidades importantes. A economia deve começar pelo desperdício."),
            criarPergunta(181, "consumo",
                "O dia esfriou e ninguém precisa do ventilador. Qual escolha faz sentido?",
                ["Mantê-lo ligado só porque ficou assim de manhã.", "Aumentar a velocidade para gastar menos.", "Deixá-lo ligado numa sala vazia até esquentar.", "Desligá-lo e ligar novamente se houver necessidade."],
                3, "As necessidades mudam com o clima e com o uso do espaço. Ajustar os aparelhos à situação evita consumo sem utilidade.")
        ]),

        criarBloco(5, 4, "Pensar antes de agir", [
            criarPergunta(185, "energia",
                "Você está com as mãos molhadas e precisa conectar um aparelho. O que fazer?",
                ["Encaixar o plugue rapidamente antes que a mão seque.", "Secar a tomada com a própria mão.", "Segurar o aparelho pelo fio para conectar.", "Afastar-se da tomada e pedir ajuda a um adulto."],
                3, "Água e eletricidade exigem cuidado. Crianças devem pedir ajuda para conectar aparelhos e se manter longe de partes elétricas molhadas."),
            criarPergunta(186, "fontes",
                "Há folhas sobre um painel solar no telhado. Como uma criança pode ajudar?",
                ["Subir usando uma cadeira e retirar as folhas.", "Contar a um adulto, sem subir no telhado.", "Jogar água de perto sem orientação.", "Puxar os fios do painel para tentar limpar."],
                1, "Manutenção de painéis envolve altura e eletricidade. A criança pode comunicar o que viu; a avaliação deve ficar com pessoas preparadas."),
            criarPergunta(187, "sustentabilidade",
                "Uma criança percebe um desperdício que não consegue resolver. O que pode fazer?",
                ["Esconder o problema por não saber consertar.", "Desistir de todos os outros cuidados.", "Pedir ajuda a um adulto e explicar a situação.", "Achar que precisa resolver tudo sozinha."],
                2, "Cuidar dos recursos é uma responsabilidade compartilhada. Pedir ajuda é uma forma de participar e agir com segurança."),
            criarPergunta(188, "consumo",
                "Uma luz fica acesa para iluminar um caminho perigoso à noite. O que avaliar antes de apagá-la?",
                ["Somente se a lâmpada combina com a parede.", "Apenas se alguém quer ganhar uma disputa de economia.", "Se ela é necessária para a segurança das pessoas.", "Só o fato de estar acesa, sem olhar o local."],
                2, "Nem toda luz acesa representa desperdício. A economia precisa considerar as necessidades e a segurança de quem usa o espaço."),
            criarPergunta(189, "agua",
                "Como economizar água sem prejudicar um animal de estimação?",
                ["Deixar o recipiente vazio por várias horas.", "Manter água limpa disponível e evitar desperdício ao cuidar do recipiente.", "Oferecer só a água que sobrou da limpeza do chão.", "Dar água apenas quando alguém lembrar à noite."],
                1, "Animais precisam de acesso à água adequada. O cuidado é evitar desperdício na rotina, sem deixar de atender à saúde deles.")
        ]),

        criarBloco(5, 5, "Missão da energia", [
            criarPergunta(193, "sustentabilidade",
                "Qual plano cuida da água e da energia ao mesmo tempo?",
                ["Fechar torneiras e manter a televisão ligada sem uso.", "Fazer cartazes e ignorar os problemas observados.", "Apagar luzes e deixar a mangueira correndo.", "Avisar sobre vazamentos e apagar luzes desnecessárias."],
                3, "Um plano pode reunir cuidados diferentes. Observar, agir com segurança e pedir ajuda tornam esses cuidados parte da rotina."),
            criarPergunta(194, "reaproveitamento",
                "A turma vai montar um jogo. Qual escolha aproveita melhor os recursos?",
                ["Usar papelão limpo disponível e pedir ajuda para os cortes.", "Usar qualquer embalagem, mesmo suja ou cortante.", "Comprar materiais novos sem conferir o que já existe.", "Jogar fora o jogo depois da primeira partida."],
                0, "Materiais seguros que já existem podem ganhar outra função. A ajuda de um adulto é importante em tarefas como cortar papelão."),
            criarPergunta(195, "agua",
                "Na missão de detetive da água, qual registro é mais útil?",
                ["Uma lista de colegas considerados culpados.", "Local, horário e descrição de um possível desperdício.", "Apenas um desenho sem indicar o local observado.", "Uma conclusão sobre toda a escola sem observar."],
                1, "Boas pistas ajudam o adulto a verificar o problema. O objetivo da missão é encontrar cuidados possíveis, não culpar pessoas."),
            criarPergunta(196, "sustentabilidade",
                "A turma conseguiu manter um hábito de economia por uma semana. Qual pode ser o próximo passo?",
                ["Gastar mais na semana seguinte para compensar.", "Continuar o hábito e escolher outro cuidado possível.", "Parar com o cuidado porque a missão já aconteceu.", "Trocar o hábito por uma promessa sem ação."],
                1, "A sustentabilidade depende de cuidados que continuam. Novos objetivos podem ser adicionados aos poucos, sem abandonar o que já funciona."),
            criarPergunta(197, "sustentabilidade",
                "Quem deve participar do cuidado com a água, a energia e a natureza?",
                ["Pessoas, escolas, empresas e governos, cada um com sua responsabilidade.", "Apenas quem mora perto de rios e florestas.", "Só as famílias que têm painéis solares.", "Somente as crianças que estão aprendendo sobre o assunto."],
                0, "As ações das crianças são importantes, mas elas não precisam resolver tudo. Adultos, instituições e governos também têm responsabilidades.")
        ])
    ]
});

module.exports = trilhaFacil;