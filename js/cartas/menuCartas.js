const platosTest = [
    { nombrePlato: "Pupusa de Queso", descripcion: "Pupusa tradicional rellena de queso derretido", precio: 0.75, categoria: "Pupusas", img: "../img/menu/pupusa-queso.jpg" },
    { nombrePlato: "Pupusa Revuelta", descripcion: "Rellena de chicharrón, queso y frijol", precio: 1.00, categoria: "Pupusas", img: "../img/menu/pupusa-revuelta.jpg" },
    { nombrePlato: "Pupusa de Loroco", descripcion: "Rellena de loroco con queso", precio: 1.00, categoria: "Pupusas", img: "../img/menu/pupusa-loroco.webp" },
    { nombrePlato: "Carne Asada", descripcion: "Carne de res a la parrilla con chimol y tortillas", precio: 8.50, categoria: "Platos Principales", img: "../img/menu/carne-asada.jpg" },
    { nombrePlato: "Sopa de Gallina", descripcion: "Sopa de gallina con elote, yuca, arroz, aguacate y dos tortillas", precio: 6.99, categoria: "Platos Principales", img: "../img/menu/sopa-de-pollo.jpg" },
    { nombrePlato: "Pescado Frito", descripcion: "Pescado frito con papas al vapor y rodajas de tomate", precio: 7.50, categoria: "Platos Principales", img: "../img/menu/pescado-frito.webp" },
    { nombrePlato: "Yuca Frita", descripcion: "Yuca crujiente acompañada de curtido y jalapeños", precio: 4.50, categoria: "Entradas", img: "../img/menu/yuca-frita-chicharron.jpg" },
    { nombrePlato: "Canoas de Plátano", descripcion: "Plátanos maduros rellenos con frijoles y queso", precio: 3.50, categoria: "Entradas", img: "../img/menu/canoas-de-platano.jpg" },
    { nombrePlato: "Nuégados en Miel", descripcion: "Nuégados de yuca bañados en miel de panela", precio: 3.99, categoria: "Postres", img: "../img/menu/nuegados-en-miel.webp" },
    { nombrePlato: "Empanadas de Plátano", descripcion: "Empanadas dulces de plátano con leche y canela", precio: 1.50, categoria: "Postres", img: "../img/menu/empanadas-de-platano.jpg" },
    { nombrePlato: "Frozen natural", descripcion: "Bebida natural refrescante de fresa, uvas, frambuesas o moras", precio: 1.25, categoria: "Bebidas", img: "../img/menu/smoothies-y-batidos.jpg" },
    { nombrePlato: "Chaparro Premium", descripcion: "Licor artesanal salvadoreño", precio: 5.00, categoria: "Bebidas", img: "../img/menu/chaparro-premium.jpg" }
];

function renderizarCartas(platos) {
    platos.forEach((plato) => {
        const id = plato.id || plato.nombrePlato;
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

        if (contenedorId) {
            const contenedor = document.getElementById(contenedorId);

            if (contenedor) {
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
}

async function cargarCartas() {
    try {
        const { db } = await import('../service/firebase.js');
        const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js");

        const querySnapshot = await getDocs(collection(db, "menu"));
        const platos = [];

        querySnapshot.forEach((doc) => {
            platos.push({ id: doc.id, ...doc.data() });
        });

        if (platos.length === 0) {
            renderizarCartas(platosTest);
        } else {
            renderizarCartas(platos);
        }

    } catch (error) {
        console.warn("Firebase no disponible, cargando data de prueba...", error);
        renderizarCartas(platosTest);
    }
}

window.addEventListener('DOMContentLoaded', cargarCartas);

window.agregarAlCarrito = ( nombre, precio) => {
    alert(`El producto "${nombre}" fue agregado al carrito por ${precio}`);
};
