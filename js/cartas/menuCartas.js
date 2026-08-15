const platosTest = [
    { nombrePlato: "Pupusa de Queso", descripcion: "Pupusa tradicional rellena de queso derretido", precio: 0.75, categoria: "Pupusas", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400" },
    { nombrePlato: "Pupusa Revuelta", descripcion: "Rellena de chicharrón, queso y frijol", precio: 1.00, categoria: "Pupusas", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400" },
    { nombrePlato: "Pupusa de Loroco", descripcion: "Rellena de loroco con queso", precio: 1.00, categoria: "Pupusas", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400" },
    { nombrePlato: "Carne Asada", descripcion: "Carne de res a la parrilla con chimol y tortillas", precio: 8.50, categoria: "Platos Principales", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400" },
    { nombrePlato: "Pollo Guisado", descripcion: "Pollo en salsa con arroz y ensalada fresca", precio: 6.99, categoria: "Platos Principales", img: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400" },
    { nombrePlato: "Costilla de Cerdo", descripcion: "Costilla adobada con yuca frita y curtido", precio: 9.50, categoria: "Platos Principales", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400" },
    { nombrePlato: "Yuca Frita con Chicharrón", descripcion: "Yuca crujiente acompañada de chicharrón y curtido", precio: 4.50, categoria: "Entradas", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400" },
    { nombrePlato: "Plátanos Fritos", descripcion: "Plátanos maduros fritos con crema y frijoles", precio: 3.50, categoria: "Entradas", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400" },
    { nombrePlato: "Tres Leches", descripcion: "Pastel húmedo bañado en tres tipos de leche", precio: 3.99, categoria: "Postres", img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400" },
    { nombrePlato: "Empanadas de Leche", descripcion: "Empanadas dulces rellenas de leche y canela", precio: 1.50, categoria: "Postres", img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400" },
    { nombrePlato: "Horchata", descripcion: "Bebida refrescante de morro y semillas", precio: 1.75, categoria: "Bebidas", img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400" },
    { nombrePlato: "Chaparro Premium", descripcion: "Licor artesanal salvadoreño", precio: 5.00, categoria: "Bebidas", img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400" }
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
