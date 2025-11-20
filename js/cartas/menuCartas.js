import { db } from '../service/firebase.js'; 
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

async function cargarCartas() {
    try {
        const querySnapshot = await getDocs(collection(db, "menu"));

        querySnapshot.forEach((doc) => {
            const plato = doc.data();
            const id = doc.id;

            console.log("Producto encontrado:", plato); 

            // Para definir platos según la categoría a la que pertenecen
            let contenedorId = "";

            if (plato.categoria === "Pupusas") {
                contenedorId = "lista-Pupusas";
            } else if (plato.categoria === "Platos Principales") {
                contenedorId = "lista-PlatosPrincipales";
            } else if (plato.categoria === "Entradas") {
                contenedorId = "lista-Entradas";
            } else if (plato.categoria === "Postres") {
                contenedorId = "lista-Postres";
            } else if (plato.categoria === "Bebidas") {
                contenedorId = "lista-Bebidas";
            }

            // para crear las tarjetas de los productos
            if (contenedorId) {
                const contenedor = document.getElementById(contenedorId);
                
                if(contenedor) {
                    const tarjetaHTML = `
                        <article class="tarjeta-comida">
                            <div class="img">
                                <img src="${plato.img}" alt="${plato.nombrePlato}">
                            </div>
                            
                            <div class="info">
                                <h3>${plato.nombrePlato}</h3>
                                <p>${plato.descripcion}</p>
                                
                                <div class="precio">
                                    <h3 class="precio-actual">$${parseFloat(plato.precio).toFixed(2)}</h3>
                                </div>
                                
                                <div class="boton-ordenar">
                                    <button type="button" onclick="agregarAlCarrito('${id}', '${plato.nombrePlato}', ${plato.precio})">
                                        Agregar al carrito
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
        console.error("Error cargando las cartas:", error);
    }
}

// Cargar al inicio
window.addEventListener('DOMContentLoaded', cargarCartas);


// Para confirmar que se agregó al carrito:
window.agregarAlCarrito = (id, nombre, precio) => {
    alert(`El producto "${nombre}" fue agregado al carrito`);
};