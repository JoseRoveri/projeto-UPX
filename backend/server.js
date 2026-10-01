const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const banco = require("./database");
const fazerLogin = require("./login");
const autenticar = require("./autenticar");
const fazerLogout = require("./logout");
const listarRanking = require("./ranking");
const concluirAtividade = require("./concluir-atividade");
const {
    consultarPerfil,
    atualizarPerfil
} = require("./perfil-conta");

// Carrega os dados das 200 perguntas da nova trilha.
const trilhaFacil = require("./trilha-facil");

// Acrescentaremos as outras dificuldades quando estiverem prontas.
const trilhasDisponiveis = [trilhaFacil];

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));

app.use(express.json());

// Permite acessar os cookies em req.cookies.
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({
        mensagem: "Servidor EcoEnergia funcionando!"
    });
});

app.get("/teste-banco", async (req, res) => {
    try {
        const resultado = await banco.query(`
            SELECT COUNT(*) AS total
            FROM public.usuarios
        `);

        res.json({
            mensagem: "Conexão com PostgreSQL funcionando!",
            usuariosCadastrados: Number(resultado.rows[0].total)
        });
    } catch (erro) {
        console.error("Erro ao consultar o banco:", erro.message);

        res.status(500).json({
            mensagem: "Não foi possível consultar o banco."
        });
    }
});

app.post("/api/cadastro", async (req, res) => {
    try {
        const { nome, email, senha, tipo } = req.body || {};

        if (
            typeof nome !== "string" || !nome.trim() ||
            typeof email !== "string" || !email.trim() ||
            typeof senha !== "string" || !senha.trim() ||
            !["aluno", "professor", "responsavel"].includes(tipo)
        ) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos corretamente."
            });
        }

        const nomeLimpo = nome.trim();
        const emailLimpo = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)) {
            return res.status(400).json({
                mensagem: "Digite um e-mail válido."
            });
        }

        if (senha.length < 8) {
            return res.status(400).json({
                mensagem: "A senha precisa ter pelo menos 8 caracteres."
            });
        }

        if (Buffer.byteLength(senha, "utf8") > 72) {
            return res.status(400).json({
                mensagem: "Senha muito longa. Use uma senha mais curta."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        await banco.query(`
            INSERT INTO public.usuarios (
                nome,
                email,
                senha_hash,
                tipo
            )
            VALUES ($1, $2, $3, $4)
        `, [nomeLimpo, emailLimpo, senhaHash, tipo]);

        res.status(201).json({
            mensagem: "Cadastro realizado com sucesso!"
        });
    } catch (erro) {
        if (
            erro.code === "23505" &&
            erro.constraint === "usuarios_email_unico"
        ) {
            return res.status(409).json({
                mensagem: "Este e-mail já está cadastrado."
            });
        }

        console.error("Erro ao cadastrar:", erro.message);

        res.status(500).json({
            mensagem: "Não foi possível realizar o cadastro."
        });
    }
});

app.post("/api/login", fazerLogin);
app.post("/api/logout", fazerLogout);

app.get("/api/me", autenticar, (req, res) => {
    res.json({
        usuario: req.usuario
    });
});

app.get("/api/ranking", listarRanking);

// Consulta pública: visitantes também podem ver a estrutura da trilha.
app.get("/api/trilhas/:nivel", (req, res) => {
    res.set("Cache-Control", "no-store");

    const trilha = trilhasDisponiveis.find(
        item => item.nivel === req.params.nivel
    );

    if (!trilha) {
        return res.status(404).json({
            mensagem: "Esta dificuldade ainda não possui uma trilha disponível."
        });
    }

    // Seleciona os dados necessários para montar a tela dos módulos.
    const modulos = trilha.modulos.map(modulo => ({
        id: modulo.id,
        nome: modulo.nome,
        ordem: modulo.ordem,
        introducao: modulo.introducao,
        blocos: modulo.blocos.map(bloco => ({
            atividadeId: bloco.atividadeId,
            nome: bloco.nome,
            ordem: bloco.ordem,
            totalPerguntas: bloco.perguntas.length,
            xpMaximo: bloco.perguntas.length * trilha.xpPorAcerto
        }))
    }));

    // Reúne os blocos dos módulos para calcular os totais.
    const blocos = modulos.flatMap(modulo => modulo.blocos);

    const totalPerguntas = blocos.reduce(
        (total, bloco) => total + bloco.totalPerguntas,
        0
    );

    res.json({
        nivel: trilha.nivel,
        nome: trilha.nome,
        emoji: trilha.emoji,
        versao: trilha.versao,
        xpPorAcerto: trilha.xpPorAcerto,
        totalModulos: modulos.length,
        totalBlocos: blocos.length,
        totalPerguntas,
        modulos
    });
});

// Entrega as perguntas de um bloco para usuários e visitantes.
app.get("/api/trilhas/:nivel/blocos/:atividadeId", (req, res) => {
    res.set("Cache-Control", "no-store");

    const trilha = trilhasDisponiveis.find(
        item => item.nivel === req.params.nivel
    );

    if (!trilha) {
        return res.status(404).json({
            mensagem: "Esta dificuldade ainda não possui uma trilha disponível."
        });
    }

    const modulo = trilha.modulos.find(item =>
        item.blocos.some(bloco =>
            bloco.atividadeId === req.params.atividadeId
        )
    );

    if (!modulo) {
        return res.status(404).json({
            mensagem: "Bloco não encontrado nesta trilha."
        });
    }

    const bloco = modulo.blocos.find(
        item => item.atividadeId === req.params.atividadeId
    );

    // Envia apenas os dados necessários para mostrar as questões.
    const perguntas = bloco.perguntas.map(pergunta => ({
        id: pergunta.id,
        tema: pergunta.tema,
        categoria: pergunta.categoria,
        pergunta: pergunta.pergunta,
        alternativas: pergunta.alternativas
    }));

    res.json({
        nivel: trilha.nivel,
        atividadeId: bloco.atividadeId,
        moduloId: modulo.id,
        moduloNome: modulo.nome,
        nome: bloco.nome,
        totalPerguntas: perguntas.length,
        xpPorAcerto: trilha.xpPorAcerto,
        xpMaximo: perguntas.length * trilha.xpPorAcerto,
        perguntas
    });
});

// Consulta o progresso da conta que está conectada.
app.get("/api/trilhas/:nivel/progresso", autenticar, async (req, res) => {
    res.set("Cache-Control", "no-store");

    const trilha = trilhasDisponiveis.find(
        item => item.nivel === req.params.nivel
    );

    if (!trilha) {
        return res.status(404).json({
            mensagem: "Esta dificuldade ainda não possui uma trilha disponível."
        });
    }

    const blocos = trilha.modulos.flatMap(modulo => modulo.blocos);
    const idsDosBlocos = blocos.map(bloco => bloco.atividadeId);

    try {
        // O usuário é identificado pela sessão de login.
        const resultado = await banco.query(`
            SELECT atividade_id
            FROM public.atividades_concluidas
            WHERE usuario_id = $1
              AND atividade_id = ANY($2::text[])
              AND total_perguntas > 0
              AND acertos * 2 >= total_perguntas
        `, [req.usuario.id, idsDosBlocos]);

        const idsConcluidos = new Set(
            resultado.rows.map(registro => registro.atividade_id)
        );

        let anterioresConcluidos = true;

        const progresso = blocos.map(bloco => {
            const concluido = idsConcluidos.has(bloco.atividadeId);
            const liberado = concluido || anterioresConcluidos;

            anterioresConcluidos = anterioresConcluidos && concluido;

            return {
                atividadeId: bloco.atividadeId,
                concluido,
                liberado
            };
        });

        const blocosConcluidos = progresso.filter(
            bloco => bloco.concluido
        ).length;

        const proximoBloco = progresso.find(
            bloco => !bloco.concluido && bloco.liberado
        );

        res.json({
            nivel: trilha.nivel,
            totalBlocos: blocos.length,
            blocosConcluidos,
            porcentagem: blocos.length > 0
                ? Math.round((blocosConcluidos / blocos.length) * 100)
                : 0,
            proximaAtividadeId: proximoBloco?.atividadeId ?? null,
            blocos: progresso
        });
    } catch (erro) {
        console.error("Erro ao consultar progresso:", erro.message);

        res.status(500).json({
            mensagem: "Não foi possível consultar o progresso da trilha."
        });
    }
});

app.post("/api/atividade/concluir", autenticar, concluirAtividade);

app.get("/api/perfil", autenticar, consultarPerfil);
app.patch("/api/perfil", autenticar, atualizarPerfil);

app.listen(3000, "127.0.0.1", () => {
    console.log("Servidor rodando em http://127.0.0.1:3000");
});