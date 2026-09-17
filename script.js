
// ========================================
// NAVBAR MOBILE
// ========================================

const navbarToggle = document.querySelector("#navbar-toggle");
const navbarMenu = document.querySelector("#navbar-menu");

if (navbarToggle && navbarMenu) {

    const navbarLinks = navbarMenu.querySelectorAll(".navbar-link");

    // Abrir e fechar menu

    const toggleMenu = () => {

        const isOpen = navbarMenu.classList.toggle("active");

        navbarToggle.classList.toggle("active", isOpen);

        navbarToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        navbarToggle.setAttribute(
            "aria-label",
            isOpen ? "Fechar menu" : "Abrir menu"
        );

    };


    // Fechar menu

    const closeMenu = () => {

        navbarMenu.classList.remove("active");

        navbarToggle.classList.remove("active");

        navbarToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        navbarToggle.setAttribute(
            "aria-label",
            "Abrir menu"
        );

    };


    // Clique no botão

    navbarToggle.addEventListener("click", toggleMenu);


    // Fechar ao clicar em um link

    navbarLinks.forEach((link) => {

        link.addEventListener("click", closeMenu);

    });


    // Fechar ao clicar fora da navbar

    document.addEventListener("click", (event) => {

        if (!event.target.closest(".navbar")) {
            closeMenu();
        }

    });


    // Fechar com a tecla Escape

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            closeMenu();
        }

    });


    // Fechar ao voltar para desktop

    window.addEventListener("resize", () => {

        if (window.innerWidth > 600) {
            closeMenu();
        }

    });

}


/* =========================================================
   PROJETOS DESTAQUES
   CAROUSEL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const carousel = document.querySelector(
        ".projects-carousel"
    );

    const track = document.querySelector(
        ".projects-track"
    );

    const slides = Array.from(
        document.querySelectorAll(".project-slide")
    );

    const previousButton = document.querySelector(
        ".projects-arrow-prev"
    );

    const nextButton = document.querySelector(
        ".projects-arrow-next"
    );


    /* =====================================================
       VERIFICAÇÃO
    ===================================================== */

    if (
        !carousel ||
        !track ||
        slides.length === 0 ||
        !previousButton ||
        !nextButton
    ) {
        return;
    }


    /* =====================================================
       ESTADO
    ===================================================== */

    let currentIndex = 0;

    let startX = 0;

    let dragDistance = 0;

    let isDragging = false;


    /* =====================================================
       CALCULAR POSIÇÃO
    ===================================================== */

    function getPosition() {

        const slide = slides[currentIndex];

        if (!slide) {
            return 0;
        }


        const slideWidth =
            slide.getBoundingClientRect().width;


        const containerWidth =
            carousel.getBoundingClientRect().width;


        const isMobile =
            window.innerWidth <= 600;


        /*
         * MOBILE
         *
         * Mostra uma parte do próximo projeto.
         */

        if (isMobile) {

            return currentIndex * slideWidth;

        }


        /*
         * DESKTOP / TABLET
         *
         * Centraliza o projeto principal.
         */

        return (
            currentIndex * slideWidth
            - (containerWidth - slideWidth) / 2
        );

    }


    /* =====================================================
       ATUALIZAR CAROUSEL
    ===================================================== */

    function updateCarousel(animate = true) {

        track.style.transition = animate
            ? "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)"
            : "none";


        const position = getPosition();


        track.style.transform =
            `translate3d(${-position}px, 0, 0)`;

    }


    /* =====================================================
       PRÓXIMO
    ===================================================== */

    function nextProject() {

        currentIndex++;

        if (currentIndex >= slides.length) {
            currentIndex = 0;
        }

        updateCarousel(true);

    }


    /* =====================================================
       ANTERIOR
    ===================================================== */

    function previousProject() {

        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = slides.length - 1;
        }

        updateCarousel(true);

    }


    /* =====================================================
       BOTÕES
    ===================================================== */

    nextButton.addEventListener(
        "click",
        nextProject
    );


    previousButton.addEventListener(
        "click",
        previousProject
    );


    /* =====================================================
       INÍCIO DO ARRASTE
    ===================================================== */

    function startDrag(event) {

        isDragging = true;

        carousel.classList.add("is-dragging");

        startX = getPointerX(event);

        dragDistance = 0;

        track.style.transition = "none";

    }


    /* =====================================================
       DURANTE O ARRASTE
    ===================================================== */

    function moveDrag(event) {

        if (!isDragging) {
            return;
        }


        const currentX =
            getPointerX(event);


        dragDistance =
            currentX - startX;


        /*
         * Movimento visual
         */

        const basePosition =
            getPosition();


        track.style.transform =
            `translate3d(${-basePosition + dragDistance}px, 0, 0)`;


        /*
         * Evita seleção de texto.
         */

        if (Math.abs(dragDistance) > 5) {

            event.preventDefault();

        }

    }


    /* =====================================================
       FINALIZAR ARRASTE
    ===================================================== */

    function endDrag() {

        if (!isDragging) {
            return;
        }


        isDragging = false;

        carousel.classList.remove("is-dragging");


        const minimumSwipe = 60;


        /*
         * Arrastou para esquerda
         */

        if (dragDistance < -minimumSwipe) {

            nextProject();

        }


        /*
         * Arrastou para direita
         */

        else if (dragDistance > minimumSwipe) {

            previousProject();

        }


        /*
         * Arraste insuficiente
         */

        else {

            updateCarousel(true);

        }


        startX = 0;

        dragDistance = 0;

    }


    /* =====================================================
       POSIÇÃO DO POINTER
    ===================================================== */

    function getPointerX(event) {

        if (
            event.touches &&
            event.touches.length
        ) {

            return event.touches[0].clientX;

        }


        if (
            event.changedTouches &&
            event.changedTouches.length
        ) {

            return event.changedTouches[0].clientX;

        }


        return event.clientX;

    }


    /* =====================================================
       TOUCH
    ===================================================== */

    carousel.addEventListener(
        "touchstart",
        startDrag,
        { passive: true }
    );


    carousel.addEventListener(
        "touchmove",
        moveDrag,
        { passive: false }
    );


    carousel.addEventListener(
        "touchend",
        endDrag
    );


    carousel.addEventListener(
        "touchcancel",
        endDrag
    );


    /* =====================================================
       MOUSE
    ===================================================== */

    carousel.addEventListener(
        "mousedown",
        startDrag
    );


    window.addEventListener(
        "mousemove",
        moveDrag
    );


    window.addEventListener(
        "mouseup",
        endDrag
    );


    /* =====================================================
       TECLADO
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            const activeElement =
                document.activeElement;


            const isTyping =
                activeElement &&
                (
                    activeElement.tagName === "INPUT" ||
                    activeElement.tagName === "TEXTAREA" ||
                    activeElement.tagName === "SELECT"
                );


            if (isTyping) {
                return;
            }


            if (event.key === "ArrowRight") {

                nextProject();

            }


            if (event.key === "ArrowLeft") {

                previousProject();

            }

        }
    );


    /* =====================================================
       RESPONSIVIDADE
    ===================================================== */

    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);


            resizeTimer = setTimeout(() => {

                updateCarousel(false);

            }, 150);

        }
    );


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    updateCarousel(false);

});