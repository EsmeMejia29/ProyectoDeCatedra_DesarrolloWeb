import {
    obtenerPromos, agregarPromo, modificarPromo, eliminarPromo
} from '../service/promosConfig.js';

document.addEventListener("DOMContentLoaded", () => {
    mostrarPromociones();
});

const btnAgregarPromo = document.querySelector("#addPromocion");

//Se agrega el evento click y su funcion
btnAgregarPromo.addEventListener("click", desplegarFormulario);

export async function mostrarPromociones() {
    try {
        const result = await obtenerPromos();
        const container = document.querySelector("#promosLista");

        if (!result.data || result.data.length === 0) {
            container.innerHTML = '<p>No hay promociones disponibles</p>';
            return;
        }

        container.innerHTML = result.data.map((promo) =>
            `<div class="card">
                    <img src="${promo.img}" class="card-img-top" alt="...">
                    <div class="card-body ${promo.categoria}">
                        <h5 class="card-title">${promo.nombrePromo}</h5>
                        <p class="text-muted">${promo.descripcion}</p>
                        <p class="text-muted precio">Precio pormoción: ${promo.precioPromo}</p>
                        <p class="text-muted precio">Precio anterior: ${promo.precioAnterior}</p>
                        <button type="button" class="btn btn-light btnEditarPromo" data-id="${promo.id}"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button type="button" class="btn btn-danger btnEliminarPromo" data-id="${promo.id}"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                </div>`
        ).join("");

        //Listeners para editar
        document.querySelectorAll(".btnEditarPromo").forEach(btn => {
            btn.addEventListener("click", () => {
                const plato = result.data.find(p => p.id === btn.dataset.id);
                desplegarEditablePlato(plato);
            });
        });

        // Listeners para eliminar
        document.querySelectorAll(".btnEliminarPromo").forEach(btn => {
            btn.addEventListener("click", () => {
                const platoId = btn.dataset.id;
                EliminarPlatoDelMenu(platoId);
            });
        });
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

async function desplegarEditablePlato(plato) {
    const container = document.querySelector("#menuFormulario");

    // Desplegamos el formulario con los datos del plato
    container.innerHTML = `
    <form onsubmit="return false">
        <div class="mb-3">
            <label for="nombrePlato" class="form-label">Nombre del Plato</label>
            <input type="text" class="form-control" id="nombrePlato" value="${plato.nombrePlato}">
        </div>

        <div class="mb-3">
            <label for="categoria" class="form-label">Categoría</label>
            <select class="form-select" id="categoria">
                <option value="Pupusas" ${plato.categoria === 'Pupusas' ? 'selected' : ''}>Pupusas</option>
                <option value="Entradas" ${plato.categoria === 'Entradas' ? 'selected' : ''}>Entradas</option>
                <option value="Platos Principales" ${plato.categoria === 'Platos Principales' ? 'selected' : ''}>Platos Principales</option>
                <option value="Postres" ${plato.categoria === 'Postres' ? 'selected' : ''}>Postres</option>
                <option value="Bebidas" ${plato.categoria === 'Bebidas' ? 'selected' : ''}>Bebidas</option>
            </select>
        </div>

        <div class="mb-3">
            <label for="descripcion" class="form-label">Descripción</label>
            <textarea id="descripcion" cols="30" rows="5">${plato.descripcion}</textarea>
        </div>

        <div class="mb-3">
            <label for="precio" class="form-label">Precio</label>
            <input type="text" class="form-control" id="precio" value="${plato.precio}">
        </div>

        <div class="mb-3">
            <label for="imgPlato" class="form-label">Fotografía del plato</label>
            <input type="text" class="form-control" id="imgPlato" value="${plato.img}">
        </div>

        <button type="button" class="btn btn-secondary" id="CancelarFormulario">Cancelar</button>
        <button type="button" class="btn btn-primary" id="ActualizarProducto">Guardar Cambios</button>
    </form>
    `;

    // Listener para cancelar
    const btnCancelar = document.querySelector("#CancelarFormulario");
    btnCancelar.addEventListener("click", () => {
        container.innerHTML = "";
    });

    // Listener para guardar cambios
    const btnActualizar = document.querySelector("#ActualizarProducto");
    btnActualizar.addEventListener("click", async () => {
        await guardarCambios(plato.id); 
    });
}

async function guardarCambios(platoNombre) {
    const nombrePlato = document.querySelector("#nombrePlato").value.toString();
    const categoria = document.querySelector("#categoria").value;
    const descripcion = document.querySelector("#descripcion").value.toString();
    const precio = document.querySelector("#precio").value.toString();
    const imagen = document.querySelector("#imgPlato").value.toString();

    if (!nombrePlato || !categoria || !descripcion || !precio || !imagen) {
        alert("Por favor completa todos los campos");
        return;
    }

    const platoActualizado = {
        nombrePlato: nombrePlato,
        categoria: categoria,
        descripcion: descripcion,
        precio: precio,
        img: imagen
    };

    try {
        await modificarPlato(platoNombre, platoActualizado);
        alert("Plato actualizado correctamente");
        mostrarMenu(); 
        document.querySelector("#menuFormulario").innerHTML = ""; // cerrar formulario
    } catch (error) {
        console.error("Error actualizando plato:", error);
    }
}

async function EliminarPlatoDelMenu(platoId){
    try {
        await eliminarPlato(platoId);
        alert("Plato eliminado exitosamente");
        mostrarMenu(); 
    } catch (error) {
        console.error("Error al eliminar el plato:", error);
    }
}