// =========================================================
// ECOENERGIA — ESCOLHA DE DIFICULDADE
// =========================================================

const cardsDificuldade =
    document.querySelectorAll(
        ".dificuldade-card"
    );


// =========================================================
// NOMES DAS TRILHAS ANTERIORES
// =========================================================

const requisitos = {

    medio:
        "Fácil",

    dificil:
        "Média",

    impossivel:
        "Difícil",

    tecnico:
        "Impossível"

};


// =========================================================
// CRIAR MODAL
// =========================================================

const modal =
    document.createElement(
        "div"
    );


modal.className =
    "modal-trilha-bloqueada";


modal.hidden =
    true;


modal.innerHTML = `
    <div class="modal-trilha-fundo"></div>

    <div class="modal-trilha-caixa">

        <div class="modal-trilha-icone">
            🔒
        </div>

        <h2>
            Trilha bloqueada
        </h2>

        <p id="modal-trilha-texto">
            Complete a trilha anterior para continuar.
        </p>

        <button
            type="button"
            class="btn-fechar-modal-trilha"
        >
            Entendi
        </button>

    </div>
`;


document.body.appendChild(
    modal
);


// =========================================================
// ELEMENTOS DO MODAL
// =========================================================

const textoModal =
    modal.querySelector(
        "#modal-trilha-texto"
    );


const fundoModal =
    modal.querySelector(
        ".modal-trilha-fundo"
    );


const botaoFechar =
    modal.querySelector(
        ".btn-fechar-modal-trilha"
    );


// =========================================================
// ABRIR MODAL
// =========================================================

function abrirModal(
    nivel
) {

    const trilhaAnterior =
        requisitos[nivel] ||
        "anterior";


    textoModal.textContent =
        `Complete a Trilha ${trilhaAnterior} para desbloquear este desafio.`;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-aberto"
    );

}


// =========================================================
// FECHAR MODAL
// =========================================================

function fecharModal() {

    modal.hidden =
        true;


    document.body.classList.remove(
        "modal-aberto"
    );

}


// =========================================================
// CONFIGURAR CARDS
// =========================================================

cardsDificuldade.forEach(
    card => {

        const nivel =
            card.dataset.nivel;


        const botao =
            card.querySelector(
                ".btn-dificuldade"
            );


        if (!botao) {
            return;
        }


        // =================================================
        // FÁCIL CONTINUA DISPONÍVEL
        // =================================================

        if (
            nivel ===
            "facil"
        ) {

            return;

        }


        // =================================================
        // OUTRAS TRILHAS FICAM BLOQUEADAS
        // =================================================

        card.classList.add(
            "dificuldade-bloqueada"
        );


        botao.textContent =
            "🔒 Bloqueado";


        botao.setAttribute(
            "aria-label",
            "Trilha bloqueada"
        );


        // Selo no card

        const selo =
            document.createElement(
                "span"
            );


        selo.className =
            "selo-trilha-bloqueada";


        selo.textContent =
            "🔒 BLOQUEADO";


        card.appendChild(
            selo
        );


        // Bloqueia a navegação normal

        botao.addEventListener(
            "click",
            evento => {

                evento.preventDefault();


                abrirModal(
                    nivel
                );

            }
        );

    }
);


// =========================================================
// FECHAR MODAL
// =========================================================

botaoFechar.addEventListener(
    "click",
    fecharModal
);


fundoModal.addEventListener(
    "click",
    fecharModal
);


document.addEventListener(
    "keydown",
    evento => {

        if (
            evento.key ===
                "Escape" &&

            !modal.hidden
        ) {

            fecharModal();

        }

    }
);