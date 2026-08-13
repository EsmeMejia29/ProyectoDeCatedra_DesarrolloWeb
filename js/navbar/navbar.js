const btnOpenHiddenMenu = document.querySelector(".burger-menu");
const container = document.querySelector("#menuForSmallDevices");

const path = window.location.pathname;
const isInSubfolder = path.includes('/html/') || path.includes('/admin/');
const base = isInSubfolder ? '..' : '.';

container.innerHTML = `
    <ul>
        <li id="button-menu">
            <button class="close-menu">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </li>
        <li>
            <a href="${base}/index.html" class="iconos">
                <img src="${base}/img/IconInicio.png" alt="Inicio"> Inicio
            </a>
        </li>
        <li>
            <a href="${base}/html/menu.html" class="iconos">
                <img src="${base}/img/IconMenu.png" alt="Menu"> Menú
            </a>
        </li>
        <li>
            <a href="${base}/html/promocion.html" class="iconos">
                <img src="${base}/img/IconPromocion.png" alt="Promocion"> Promociones
            </a>
        </li>
        <li>
            <a href="${base}/html/aboutus.html" class="iconos">
                <img src="${base}/img/IconNosotros.png" alt="Nosotros"> Nosotros
            </a>
        </li>
        <li>
            <a href="${base}/html/contacto.html" class="iconos">
                <img src="${base}/img/IconContacto.png" alt="Contacto"> Contacto
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
