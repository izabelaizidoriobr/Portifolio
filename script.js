// NAVBAR

"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navbarNav = document.querySelector(".navbar-nav");
const navbar = document.querySelector(".navbar");

const mobileBreakpoint = 768;


/* ================================
   ABRIR E FECHAR MENU
================================ */

function toggleMenu() {
    const isOpen = navbarNav.classList.toggle("is-open");

    menuToggle.classList.toggle("is-active", isOpen);

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu" : "Abrir menu"
    );
}


/* ================================
   FECHAR MENU
================================ */

function closeMenu() {
    navbarNav.classList.remove("is-open");

    menuToggle.classList.remove("is-active");

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.setAttribute("aria-label", "Abrir menu");
}


/* ================================
   EVENTOS
================================ */

// Abrir e fechar pelo botão
menuToggle.addEventListener("click", toggleMenu);


// Fechar ao clicar em qualquer link
navbarNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});


// Fechar ao clicar fora da navbar
document.addEventListener("click", (event) => {

    const isOpen = navbarNav.classList.contains("is-open");

    const clickedInsideNavbar = navbar.contains(event.target);

    if (isOpen && !clickedInsideNavbar) {
        closeMenu();
    }

});


// Fechar com a tecla ESC
document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        closeMenu();
    }

});


// Fechar ao voltar para desktop
window.addEventListener("resize", () => {

    if (window.innerWidth > mobileBreakpoint) {
        closeMenu();
    }

});

// CARDS PROJETOS

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


/* =========================================================
   SOBRE MIM
   SCROLL REVEAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const sobreSection = document.querySelector(".sobre");

    if (!sobreSection) {
        return;
    }


    /* =====================================================
       OBSERVER
    ===================================================== */

    const observer = new IntersectionObserver(

        (entries, observerInstance) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("is-visible");

                    observerInstance.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.15
        }

    );


    observer.observe(sobreSection);

});


/* ==================================================
   CONTATO
   ================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");
    const statusMessage = document.getElementById("formStatus");

    if (!form) return;


    /* ==================================================
       ANIMAÇÃO DE ENTRADA
       ================================================== */

    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("active");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12
        }
    );


    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });


    /* ==================================================
       ELEMENTOS DO FORMULÁRIO
       ================================================== */

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");


    /* ==================================================
       VALIDAÇÃO DE E-MAIL
       ================================================== */

    const isValidEmail = (email) => {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    };


    /* ==================================================
       MOSTRAR ERRO
       ================================================== */

    const showError = (input, message) => {

        const field = input.closest(".form-field");
        const error = field.querySelector(".field-error");

        field.classList.add("error");

        if (error) {
            error.textContent = message;
        }

    };


    /* ==================================================
       LIMPAR ERRO
       ================================================== */

    const clearError = (input) => {

        const field = input.closest(".form-field");

        field.classList.remove("error");

        const error = field.querySelector(".field-error");

        if (error) {
            error.textContent = "";
        }

    };


    /* ==================================================
       LIMPAR TODOS OS ERROS
       ================================================== */

    const clearAllErrors = () => {

        form.querySelectorAll(".form-field").forEach((field) => {

            field.classList.remove("error");

            const error = field.querySelector(".field-error");

            if (error) {
                error.textContent = "";
            }

        });

    };


    /* ==================================================
       VALIDAÇÃO
       ================================================== */

    const validateForm = () => {

        let isValid = true;

        clearAllErrors();


        /* Nome */

        if (nameInput.value.trim().length < 2) {

            showError(
                nameInput,
                "Digite seu nome."
            );

            isValid = false;
        }


        /* E-mail */

        if (!isValidEmail(emailInput.value.trim())) {

            showError(
                emailInput,
                "Digite um e-mail válido."
            );

            isValid = false;
        }


        /* Assunto */

        if (!subjectInput.value) {

            showError(
                subjectInput,
                "Selecione um assunto."
            );

            isValid = false;
        }


        /* Mensagem */

        if (messageInput.value.trim().length < 10) {

            showError(
                messageInput,
                "Conte um pouco mais sobre sua mensagem."
            );

            isValid = false;
        }


        return isValid;

    };


    /* ==================================================
       LIMPAR ERRO AO DIGITAR
       ================================================== */

    [
        nameInput,
        emailInput,
        subjectInput,
        messageInput
    ].forEach((input) => {

        input.addEventListener("input", () => {

            clearError(input);

            statusMessage.textContent = "";
            statusMessage.className = "form-status";

        });

    });


    /* ==================================================
       ENVIO
       ================================================== */

    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        if (!validateForm()) {

            statusMessage.textContent =
                "Confira os campos destacados.";

            statusMessage.className =
                "form-status error";

            return;

        }


        const submitButton =
            form.querySelector(".contact-submit");

        const submitText =
            submitButton.querySelector(".submit-text");


        const originalText =
            submitText.textContent;


        /* Estado de carregamento */

        submitButton.disabled = true;

        submitText.textContent =
            "Enviando...";


        statusMessage.textContent = "";


        /*
         * ==================================================
         * INTEGRAÇÃO DO FORMULÁRIO
         * ==================================================
         *
         * Aqui você poderá conectar:
         *
         * - Formspree
         * - Web3Forms
         * - EmailJS
         * - seu próprio backend
         *
         * Exemplo:
         *
         * const formData = new FormData(form);
         *
         * await fetch("SUA_URL_API", {
         *     method: "POST",
         *     body: formData
         * });
         *
         */


        try {

            /*
             * Simulação temporária.
             *
             * Remova este timeout quando
             * conectar o backend.
             */

            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });


            statusMessage.textContent =
                "Mensagem enviada com sucesso! Obrigada pelo contato.";

            statusMessage.className =
                "form-status success";


            form.reset();


        } catch (error) {

            console.error(
                "Erro ao enviar formulário:",
                error
            );


            statusMessage.textContent =
                "Não foi possível enviar sua mensagem. Tente novamente.";

            statusMessage.className =
                "form-status error";


        } finally {

            submitButton.disabled = false;

            submitText.textContent =
                originalText;

        }

    });

});


/* =========================================================
   FOOTER
========================================================= */

const footer = document.querySelector(".site-footer");

if (footer) {

    /* =====================================================
       ANO ATUAL
    ====================================================== */

    const year = footer.querySelector("#site-footer-year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* =====================================================
       ACCORDION DO FOOTER — MOBILE
    ====================================================== */

    const footerColumns = footer.querySelectorAll(
        ".site-footer__column"
    );

    const mobileBreakpoint = 768;


    footerColumns.forEach((column) => {

        const button = column.querySelector(
            ".site-footer__title"
        );

        if (!button) return;


        button.addEventListener("click", () => {

            /* Accordion funciona somente no mobile */

            if (window.innerWidth > mobileBreakpoint) {
                return;
            }


            const isOpen =
                column.classList.contains("is-open");


            /* Fecha as outras colunas */

            footerColumns.forEach((otherColumn) => {

                otherColumn.classList.remove(
                    "is-open"
                );

                const otherButton =
                    otherColumn.querySelector(
                        ".site-footer__title"
                    );

                if (otherButton) {
                    otherButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }

            });


            /* Abre a coluna selecionada */

            if (!isOpen) {

                column.classList.add("is-open");

                button.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

        });

    });


    /* =====================================================
       RESET AO VOLTAR PARA DESKTOP
    ====================================================== */

    window.addEventListener("resize", () => {

        if (window.innerWidth > mobileBreakpoint) {

            footerColumns.forEach((column) => {

                column.classList.remove(
                    "is-open"
                );

                const button =
                    column.querySelector(
                        ".site-footer__title"
                    );

                if (button) {
                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }

            });

        }

    });

}