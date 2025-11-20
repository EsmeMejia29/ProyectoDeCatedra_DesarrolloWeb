import { db } from '../service/firebase.js'; 
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

async function cargarPromociones() {
    try {
        const querySnapshot = await getDocs(collection(db, "promociones"));

        querySnapshot.forEach((doc) => {
            const promo = doc.data();
            const id = doc.id;

            let contenedorId = "";

            //Comparador de categorías según la BD:
            if (promo.categoria === "Combos" || promo.categoria === "Combos en Oferta") {
                contenedorId = "lista-Combos";
            } else if (promo.categoria === "Paquete Familiar" || promo.categoria === "Familiar") {
                contenedorId = "lista-Familiar";
            } else if (promo.categoria === "Fin de Semana") {
                contenedorId = "lista-FinSemana";
            } else if (promo.categoria === "Hora Feliz") {
                contenedorId = "lista-HoraFeliz";
            }

            // Para mostrar las cartas:
            if (contenedorId) {
                const contenedor = document.getElementById(contenedorId);

                if (contenedor) {
                    // Esto es para que se muestre lo de descuento:
                    const etiquetaDescuento = promo.descuento 
                        ? `<div class="porcentaje-descuento"><p>${promo.descuento}% OFF</p></div>` 
                        : '';

                    // Para evitar bug con los precios:
                    const precioActual = parseFloat(promo.precioPromo).toFixed(2);
                    const precioViejo = parseFloat(promo.precioAnterior).toFixed(2);

                    // Lo principal de las cartas, lo del html:
                    const tarjetaHTML = `
                        <article class="tarjeta-comida">
                            <div class="img">
                                <img src="${promo.img}" alt="${promo.nombrePromo}">
                            </div>
                            
                            ${etiquetaDescuento}
                            
                            <div class="info">
                                <h3>${promo.nombrePromo}</h3>
                                <p>${promo.descripcion}</p>
                                
                                <div class="precio">
                                    <h3 class="precio-descuento">$${precioActual}</h3>
                                    <p class="precio-original">$${precioViejo}</p>
                                </div>
                                
                                <div class="boton-ordenar">
                                    <button type="button" onclick="agregarAlCarrito('${id}', '${promo.nombrePromo}', ${precioActual})">
                                        Ordenar Ahora
                                    </button>
                                </div>
                            </div>
                        </article>
                    `;

                    contenedor.innerHTML += tarjetaHTML;
                }
            }
        });

    } catch (error) {
        console.error("Error cargando las promociones:", error);
    }
}

// Cargar al iniciar la página
window.addEventListener('DOMContentLoaded', cargarPromociones);

// Función para confirmar que se agrego el pedido al carrito 
window.agregarAlCarrito = (id, nombre, precio) => {
    alert(`Agregaste "${nombre}" al carrito por tan solo $${precio}`);
};