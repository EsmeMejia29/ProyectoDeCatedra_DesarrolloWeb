import {
    obtenerPlatosMenu, agregarPlato, modificarPlato, eliminarPlato
} from '../service/menuConfig.js';

import { serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js';

document.addEventListener("DOMContentLoaded", () => {
    mostrarMenu();
});

const btnAgregar = document.querySelector("#addPlato");
const btnEditar = document.querySelector("#idBtnEditar");
const btnEliminar = document.querySelector("#idBtnEliminar");

//Se agrega el evento click y su funcion
btnAgregar.addEventListener("click", desplegarFormulario);


async function mostrarMenu() {
    try {
        const result = await obtenerPlatosMenu();
        const container = document.querySelector("#platosLista");

        if (!result.data || result.data.length === 0) {
            container.innerHTML = '<p>No hay platos en el menú</p>';
            return;
        }

        container.innerHTML = result.data.map((producto) =>
            `<div class="card">
                    <img src="${producto.img}" class="card-img-top" alt="...">
                    <div class="card-body ${producto.categoria}">
                        <h5 class="card-title">${producto.nombrePlato}</h5>
                        <p class="text-muted">${producto.descripcion}</p>
                        <p class="text-muted precio">Precio: ${producto.precio}</p>
                        <button type="button" class="btn btn-light" id="idBtnEditar"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button type="button" class="btn btn-danger" id="idBtnEliminar"><i class="fa-regular fa-trash-can"> </i></button>
                    </div>
                </div>`
        ).join("");
    }
    catch (error) {
        console.error("Error mostrando menú:", error);
    }
};

async function desplegarFormulario() {
    const container = document.querySelector("#menuFormulario");

    container.innerHTML = `
    <form onsubmit="return false">
        <div class="mb-3">
            <label for="nombrePlato" class="form-label">Nombre del Plato</label>
            <input type="text" class="form-control" id="nombrePlato" placeholder="Nombre del Plato">
        </div>

        <div class="mb-3">
            <label for="categoria" class="form-label">Categoría</label>
            <select class="form-select" aria-label="" id="categoria">
                <option selected>Pupusas</option>
                <option value="1">Entradas</option>
                <option value="2">Platos Principales</option>
                <option value="3">Pupusas</option>
                <option value="4">Postres</option>
                <option value="4">Bebidas</option>
            </select>
        </div>

        <div class="mb-3">
        <label for="descripcion" class="form-label">Descripción</label>
        <textarea id="descripcion" cols="30" rows="5" placeholder="Descripción del plato"></textarea>
        </div>

        <div class="mb-3">
            <label for="precio" class="form-label">Precio</label>
            <input type="text" class="form-control" id="precio" placeholder="Precio del Plato">
        </div>

        <div class="mb-3">
            <label for="imgPlato" class="form-label">Fotografía del plato</label>
            <input type="text" class="form-control" id="imgPlato" placeholder="URL de la fotografía">
        </div>

        <button type="button" class="btn btn-secondary" id="CancelarFormulario" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary" id="AddProducto">Añadir</button>
    </form>
    `;

    const btnAnadir = document.querySelector("#AddProducto");
    btnAnadir.addEventListener("click", agregarPlatoAlMenu);

    const btnCancelar = document.querySelector("#CancelarFormulario");
    btnCancelar.addEventListener("click", () => container.innerHTML = "");
}

async function agregarPlatoAlMenu() {
    const nombrePlato = document.querySelector("#nombrePlato").value.toString();
    const categoria = document.querySelector("#categoria").value;
    const descripcion = document.querySelector("#descripcion").value.toString();
    const precio = document.querySelector("#precio").value.toString();
    const imagen = document.querySelector("#imgPlato").value.toString();

    if (!nombrePlato || !categoria || !descripcion || !precio || !imagen) {
        alert("Por favor completa todos los campos");
        return;
    }

    const platoNuevo = {
        nombrePlato: nombrePlato,
        categoria: categoria,
        descripcion: descripcion,
        precio: precio,
        img: imagen,
        createdAt: serverTimestamp()
    };

    try {
        const result = await agregarPlato(platoNuevo);
        if (result.id) {
            alert("Plato agregado correctamente");
            mostrarMenu(); 

            document.querySelector("#nombrePlato").value = "";
            document.querySelector("#descripcion").value = "";
            document.querySelector("#precio").value = "";
            document.querySelector("#imgPlato").value = "";
            document.querySelector("#nombrePlato").focus()
        } else {
            console.error(result.error);
            alert("Error al agregar el plato");
        }
    } catch (error) {
        console.error("Error en agregarPlatoAlMenu:", error);
    }
}
