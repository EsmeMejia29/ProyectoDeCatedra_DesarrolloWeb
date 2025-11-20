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
            `
            <section class="cartas-promos">
                <article class="tarjeta-comida">
                    <div class="img">
                    <img src="${promo.img}" alt="imagen promoción">
                    </div>

                    <div class="porcentaje-descuento">
                        <p class="flotante">${promo.descuento}% OFF</p>
                        
                    </div>

                    <div class="categoria">
                        <p id="flotanteCategoria">${promo.categoria}</p>
                    </div>

                    <div class="info">
                    <h3>${promo.nombrePromo}</h3>
                    <p>${promo.descripcion}</p>
                    </div>

                    <div class="precio">
                        <h3 class="precio-descuento">$ ${promo.precioPromo}</h3>
                        <p class="precio-original">$ ${promo.precioAnterior}</p>
                    </div>

                    <div class="boton">
                        <button type="button" class="btn btn-light btnEditarPromo" data-id="${promo.id}"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button type="button" class="btn btn-danger btnEliminarPromo" data-id="${promo.id}"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                </article>
            </section>
            `
        ).join("");
        
        //Listeners para editar
        document.querySelectorAll(".btnEditarPromo").forEach(btn => {
            btn.addEventListener("click", () => {
                const promo = result.data.find(p => p.id === btn.dataset.id);
                desplegarEditablePromocion(promo);
            });
        });

        // Listeners para eliminar
        document.querySelectorAll(".btnEliminarPromo").forEach(btn => {
            btn.addEventListener("click", () => {
                const promoId = btn.dataset.id;
                eliminarPromocion(promoId);
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
    <form id="formAgregarPromocion" onsubmit="return false">
    <div class="mb-3">
        <label for="nombrePromo" class="form-label">Nombre de la promoción</label>
        <input type="text" class="form-control" id="nombrePromo" placeholder="Nombre de la promoción">
    </div>

    <div class="mb-3">
        <label for="categoria" class="form-label">Categoría</label>
        <select class="form-select" id="categoria" required>
            <option value="Combos en Oferta" selected>Combos en Oferta</option>
            <option value="Paquete Familiar">Paquete Familiar</option>
            <option value="Fin de Semana">Fin de Semana</option>
            <option value="Hora Feliz">Hora Feliz</option>
        </select>
    </div>

    <div class="mb-3">
        <label for="descripcion" class="form-label">Descripción</label>
        <textarea id="descripcion" cols="30" rows="5" class="form-control" placeholder="Descripción de la promoción"
                  required></textarea>
    </div>

    <div class="mb-3">
        <label for="precioPromo" class="form-label">Precio Promoción</label>
        <input type="number" class="form-control" id="precioPromo" placeholder="Precio de la promoción"
               min="0" step="0.01" required>
    </div>

    <div class="mb-3">
        <label for="precioAnterior" class="form-label">Precio Anterior</label>
        <input type="number" class="form-control" id="precioAnterior" placeholder="Precio anterior del plato"
               min="0" step="0.01" required>
    </div>

    <div class="mb-3">
        <label for="descuento" class="form-label">Descuento (%)</label>
        <input type="number" class="form-control" id="descuento" placeholder="Porcentaje de descuento"
               min="0" max="100" step="1" required>
    </div>

    <div class="mb-3">
        <label for="imgPromo" class="form-label">Fotografía de la promoción</label>
        <input type="url" class="form-control" id="imgPromo" placeholder="URL de la fotografía" required>
    </div>

    <button type="button" class="btn btn-secondary" id="CancelarFormularioPromociones" data-bs-dismiss="modal">Cancelar</button>
    <button type="submit" class="btn btn-primary" id="AddPromocion">Añadir</button>
    </form>

    `;

    const btnAnadir = document.querySelector("#AddPromocion");
    btnAnadir.addEventListener("click", agregarPromocion);

    const btnCancelar = document.querySelector("#CancelarFormularioPromociones");
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

    if (!nombrePromocion || !categoria || !descripcion || isNaN(precioPromo) || precioPromo < 0 || isNaN(precioAnterior) || precioAnterior < 0 || isNaN(descuento) || descuento < 0 || !imagen) {
        alert("Por favor completa todos los campos correctamente");
        return;
    }    

    const promoNueva = {
        nombrePromo: nombrePromocion,
        categoria: categoria,
        descripcion: descripcion,
        precioPromo: precioPromo,
        precioAnterior: precioAnterior,
        descuento: descuento,
        img: imagen
    };

    try {
        const result = await agregarPromo(promoNueva);
        if (result.id) {
            alert("Promoción agregada correctamente");
            mostrarPromociones();

            document.querySelector("#nombrePromo").value = "";
            document.querySelector("#categoria").value = "Combos en Oferta";
            document.querySelector("#descripcion").value = "";
            document.querySelector("#precioPromo").value = "";
            document.querySelector("#precioAnterior").value = "";
            document.querySelector("#descuento").value = "";
            document.querySelector("#imgPromo").value = "";

        } else {
            console.error(result.error);
            alert("Error al agregar la promoción");
        }
    } catch (error) {
        console.error("Error en agregarPromocion:", error);
    }
}

async function desplegarEditablePromocion(promocion) {
    const container = document.querySelector("#promocionFormulario");

    // Desplegamos el formulario con los datos del plato
    container.innerHTML = `
    <form id="formEditarPromocion" onsubmit="return false">
    <div class="mb-3">
        <label for="nombrePromo" class="form-label">Nombre de la promoción</label>
        <input type="text" class="form-control" id="nombrePromo" value="${promocion.nombrePromo}"
               required>
    </div>

    <div class="mb-3">
        <label for="categoria" class="form-label">Categoría</label>
        <select class="form-select" id="categoria">
            <option value="Combos en Oferta" ${promocion.categoria === 'Combos en Oferta' ? 'selected' : ''}>Combos en Oferta</option>
            <option value="Paquete Familiar" ${promocion.categoria === 'Paquete Familiar' ? 'selected' : ''}>Paquete Familiar</option>
            <option value="Fin de Semana" ${promocion.categoria === 'Fin de Semana' ? 'selected' : ''}>Fin de Semana</option>
            <option value="Hora Feliz" ${promocion.categoria === 'Hora Feliz' ? 'selected' : ''}>Hora Feliz</option>
        </select>
    </div>

    <div class="mb-3">
        <label for="descripcion" class="form-label">Descripción</label>
        <textarea id="descripcion" cols="30" rows="5"
                  class="form-control" required>${promocion.descripcion}</textarea>
    </div>

    <div class="mb-3">
        <label for="precioPromo" class="form-label">Precio Promoción</label>
        <input type="number" class="form-control" id="precioPromo" value="${promocion.precioPromo}"
               min="0" step="0.01" required>
    </div>

    <div class="mb-3">
        <label for="precioAnterior" class="form-label">Precio Anterior</label>
        <input type="number" class="form-control" id="precioAnterior" value="${promocion.precioAnterior}"
               min="0" step="0.01" required>
    </div>

    <div class="mb-3">
        <label for="descuento" class="form-label">Descuento (%)</label>
        <input type="number" class="form-control" id="descuento" value="${promocion.descuento}"
               min="0" max="100" step="1" required>
    </div>

    <div class="mb-3">
        <label for="imgPromo" class="form-label">Fotografía de la promoción</label>
        <input type="url" class="form-control" id="imgPromo" value="${promocion.img}" required>
    </div>

    <button type="button" class="btn btn-secondary" id="CancelarFormularioPromociones">Cancelar</button>
    <button type="submit" class="btn btn-primary" id="ActualizarPromo">Guardar Cambios</button>
    </form>
    `;

    // Listener para cancelar
    const btnCancelar = document.querySelector("#CancelarFormularioPromociones");
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

    if (!nombrePromocion || !categoria || !descripcion || isNaN(precioPromo) || precioPromo < 0 || isNaN(precioAnterior) || precioAnterior < 0 || isNaN(descuento) || descuento < 0 || !imagen) {
        alert("Por favor completa todos los campos correctamente");
        return;
    } 

    const promoActualizada = {
        nombrePromo: nombrePromocion,
        categoria: categoria,
        descripcion: descripcion,
        precioPromo: precioPromo,
        precioAnterior: precioAnterior,
        descuento: descuento,
        img: imagen
    };

    try {
        await modificarPromo(platoPromocion, promoActualizada);
        alert("Promoción actualizado correctamente");
        mostrarPromociones();
        document.querySelector("#promocionFormulario").innerHTML = ""; // cerrar formulario
    } catch (error) {
        console.error("Error actualizando la promoción:", error);
    }
}

async function eliminarPromocion(promoId){
    try {
        await eliminarPromo(promoId);
        alert("Promoción eliminada exitosamente");
        mostrarPromociones(); 
    } catch (error) {
        console.error("Error al eliminar la promoción:", error);
    }
}