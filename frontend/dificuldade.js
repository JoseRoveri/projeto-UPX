// ========================================
// ECOENERGIA — ESCOLHA DE DIFICULDADE
// ========================================

const botoesDificuldade =
    document.querySelectorAll(
        ".btn-dificuldade"
    );


botoesDificuldade.forEach(
    botao => {

        botao.addEventListener(
            "click",
            function () {

                const nivel =
                    botao.dataset.nivel;


                if (!nivel) {
                    return;
                }


                window.location.href =
                    `quiz.html?nivel=${nivel}`;

            }
        );

    }
);