const btnOpenHiddenMenu = document.querySelector(".burger-menu");
const container = document.querySelector("#menuForSmallDevices");

// Insertar el menú una sola vez al cargar
container.innerHTML = `
    <ul>
        <li id="button-menu">
            <button class="close-menu">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </li>
        <li>
            <a href="../index.html" class="iconos">
                <img src="../img/IconInicio.png" alt="Inicio"> Inicio
            </a>
        </li>
        <li>
            <a href="../html/menu.html" class="iconos">
                <img src="../img/IconMenu.png" alt="Menu"> Menú
            </a>
        </li>
        <li>
            <a href="../html/promocion.html" class="iconos">
                <img src="../img/IconPromocion.png" alt="Promocion"> Promociones
            </a>
        </li>
        <li>
            <a href="../html/aboutus.html" class="iconos">
                <img src="../img/IconNosotros.png" alt="Nosotros"> Nosotros
            </a>
        </li>
        <li>
            <a href="../html/contacto.html" class="iconos">
                <img src="../img/IconContacto.png" alt="Contacto"> Contacto
            </a>
        </li>
    </ul>`;

const btnCloseMenu = container.querySelector(".close-menu");

btnOpenHiddenMenu.addEventListener("click", () => {
    container.classList.add("open");
});

btnCloseMenu.addEventListener("click", () => {
    container.classList.remove("open");
});
