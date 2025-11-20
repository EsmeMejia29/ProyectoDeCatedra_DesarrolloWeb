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
                        <p class="text-muted precio">Precio Promoción: ${promo.precioPromo}</p>
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
    const container = document.querySelector("#promocionFormulario");

    container.innerHTML = `
    <form onsubmit="return false">
        <div class="mb-3">
            <label for="nombrePromo" class="form-label">Nombre de la promoción</label>
            <input type="text" class="form-control" id="nombrePromo" placeholder="Nombre de la promoción">
        </div>

        <div class="mb-3">
            <label for="categoria" class="form-label">Categoría</label>
            <select class="form-select" aria-label="" id="categoria">
                <option selected>Combos en Oferta</option>
                <option value="Combos en Oferta">Combos en Oferta</option>
                <option value="Paquete Familiar">Paquete Familiar</option>
                <option value="Fin de Semana">Fin de Semana</option>
                <option value="Hora Feliz">Hora Feliz</option>
            </select>
        </div>

        <div class="mb-3">
            <label for="descripcion" class="form-label">Descripción</label>
            <textarea id="descripcion" cols="30" rows="5" class="form-control" placeholder="Descripción de la promoción"></textarea>
        </div>

        <div class="mb-3">
            <label for="precioPromo" class="form-label">Precio Promoción</label>
            <input type="number" 
                class="form-control" 
                id="precioPromo" 
                placeholder="Precio de la promoción"
                min="0"
                step="0.01">
        </div>

        <div class="mb-3">
            <label for="precioAnterior" class="form-label">Precio Anterior</label>
            <input type="number" 
                class="form-control" 
                id="precioAnterior" 
                placeholder="Precio anterior del plato"
                min="0"
                step="0.01">
        </div>

        <div class="mb-3">
            <label for="descuento" class="form-label">Descuento (%)</label>
            <input type="number" 
                class="form-control" 
                id="descuento" 
                placeholder="Porcentaje de descuento"
                min="0"
                max="100"
                step="1">
        </div>

        <div class="mb-3">
            <label for="imgPromo" class="form-label">Fotografía de la promoción</label>
            <input type="text" class="form-control" id="imgPromo" placeholder="URL de la fotografía">
        </div>

        <button type="button" class="btn btn-secondary" id="CancelarFormulario" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary" id="AddPromocion">Añadir</button>
    </form>
    `;

    const btnAnadir = document.querySelector("#AddPromocion");
    btnAnadir.addEventListener("click", agregarPromocion);

    const btnCancelar = document.querySelector("#CancelarFormulario");
    btnCancelar.addEventListener("click", () => container.innerHTML = "");
}

async function agregarPromocion() {
    const nombrePromocion = document.querySelector("#nombrePromo").value.trim();
    const categoria = document.querySelector("#categoria").value;
    const descripcion = document.querySelector("#descripcion").value.trim();
    const precioPromo = parseFloat(document.querySelector("#precioPromo").value);
    const precioAnterior = parseFloat(document.querySelector("#precioAnterior").value);
    const descuento = parseFloat(document.querySelector("#descuento").value);
    const imagen = document.querySelector("#imgPromo").value.trim();

    if (!nombrePromocion || !categoria || !descripcion || !precioPromo || !precioAnterior || !descuento || !imagen) {
        alert("Por favor completa todos los campos");
        return;
    }

    const platoNuevo = {
        nombrePlato: nombrePlato,
        categoria: categoria,
        descripcion: descripcion,
        precioPromo: precio,
        precioAnterior: precioAnterior,
        descuento: descuento,
        img: imagen
    };

    try {
        const result = await agregarPlato(platoNuevo);
        if (result.id) {
            alert("Plato agregado correctamente");
            mostrarPromociones();

        document.querySelector("#nombrePromo").value.trim();
        document.querySelector("#categoria").value;
        document.querySelector("#descripcion").value.trim();
        parseFloat(document.querySelector("#precioPromo").value);
        parseFloat(document.querySelector("#precioAnterior").value);
        parseFloat(document.querySelector("#descuento").value);
        document.querySelector("#imgPromo").value.trim();

        } else {
            console.error(result.error);
            alert("Error al agregar la promoción");
        }
    } catch (error) {
        console.error("Error en agregarPlatoAlMenu:", error);
    }
}

async function desplegarEditablePlato(promocion) {
    const container = document.querySelector("#promocionFormulario");

    // Desplegamos el formulario con los datos del plato
    container.innerHTML = `
    <form onsubmit="return false">
        <div class="mb-3">
            <label for="nombrePlato" class="form-label">Nombre de la promoción</label>
            <input type="text" class="form-control" id="nombrePlato" value="${promocion.nombrePromo}">
        </div>

        <div class="mb-3">
            <label for="categoria" class="form-label">Categoría</label>
            <select class="form-select" aria-label="" id="categoria">
                <option value="Combos en Oferta" ${promocion.categoria === 'Combos en Oferta' ? 'selected' : ''}>Combos en Oferta</option>
                <option value="Paquete Familiar" ${promocion.categoria === 'Paquete Familiar' ? 'selected' : ''}>Paquete Familiar</option>
                <option value="Fin de Semana" ${promocion.categoria === 'Fin de Semana' ? 'selected' : ''}>Fin de Semana</option>
                <option value="Hora Feliz" ${promocion.categoria === 'Hora Feliz' ? 'selected' : ''}>Hora Feliz</option>
            </select>
        </div>

        <div class="mb-3">
            <label for="descripcion" class="form-label">Descripción</label>
            <textarea id="descripcion" cols="30" rows="5">${promocion.descripcion}</textarea>
        </div>

        <div class="mb-3">
            <label for="precioPromo" class="form-label">Precio Promoción</label>
            <input type="number" 
                class="form-control" 
                id="precioPromo" 
                value="${promocion.precioPromo}"
                min="0"
                step="0.01">
        </div>

        <div class="mb-3">
            <label for="precioAnterior" class="form-label">Precio Anterior</label>
            <input type="number" 
                class="form-control" 
                id="precioAnterior" 
                value="${promocion.precioAnterior}"
                min="0"
                step="0.01">
        </div>

        <div class="mb-3">
            <label for="descuento" class="form-label">Descuento (%)</label>
            <input type="number" 
                class="form-control" 
                id="descuento" 
                value="${promocion.descuento}"
                min="0"
                max="100"
                step="1">
        </div>

        <div class="mb-3">
            <label for="imgPromo" class="form-label">Fotografía de la promoción</label>
            <input type="text" class="form-control" id="imgPromo" value="${promocion.img}">
        </div>

        <button type="button" class="btn btn-secondary" id="CancelarFormulario">Cancelar</button>
        <button type="button" class="btn btn-primary" id="ActualizarPromo">Guardar Cambios</button>
    </form>
    `;

    // Listener para cancelar
    const btnCancelar = document.querySelector("#CancelarFormulario");
    btnCancelar.addEventListener("click", () => {
        container.innerHTML = "";
    });

    // Listener para guardar cambios
    const btnActualizar = document.querySelector("#ActualizarPromo");
    btnActualizar.addEventListener("click", async () => {
        await guardarCambios(promocion.id); 
    });
}

async function guardarCambios(platoPromocion) {
    const nombrePromocion = document.querySelector("#nombrePromo").value.trim();
    const categoria = document.querySelector("#categoria").value;
    const descripcion = document.querySelector("#descripcion").value.trim();
    const precioPromo = parseFloat(document.querySelector("#precioPromo").value);
    const precioAnterior = parseFloat(document.querySelector("#precioAnterior").value);
    const descuento = parseFloat(document.querySelector("#descuento").value);
    const imagen = document.querySelector("#imgPromo").value.trim();

    if (!nombrePromocion || !categoria || !descripcion || !precioPromo || !precioAnterior || !descuento || !imagen) {
        alert("Por favor completa todos los campos");
        return;
    }

    const promoActualizada = {
        nombrePlato: nombrePlato,
        categoria: categoria,
        descripcion: descripcion,
        precioPromo: precio,
        precioAnterior: precioAnterior,
        descuento: descuento,
        img: imagen
    };

    try {
        await modificarPlato(platoPromocion, promoActualizada);
        alert("Promoción actualizado correctamente");
        mostrarPromociones();
        document.querySelector("#promocionFormulario").innerHTML = ""; // cerrar formulario
    } catch (error) {
        console.error("Error actualizando la promoción:", error);
    }
}

async function EliminarPlatoDelMenu(promoId){
    try {
        await eliminarPlato(promoId);
        alert("Promoción eliminada exitosamente");
        mostrarMenu(); 
    } catch (error) {
        console.error("Error al eliminar la promoción:", error);
    }
}