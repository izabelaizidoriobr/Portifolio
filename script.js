
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