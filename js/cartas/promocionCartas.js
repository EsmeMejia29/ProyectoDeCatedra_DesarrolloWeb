const promosTest = [
    { nombrePromo: "Combo Pupusero", descripcion: "3 pupusas revueltas + horchata + plátano frito", precioPromo: 4.99, precioAnterior: 7.50, descuento: 33, categoria: "Combos en Oferta", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400" },
    { nombrePromo: "Combo Carne Asada", descripcion: "Carne asada + arroz + ensalada + tortillas + bebida", precioPromo: 7.99, precioAnterior: 11.50, descuento: 30, categoria: "Combos en Oferta", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400" },
    { nombrePromo: "Combo Pollo", descripcion: "Pollo guisado + yuca frita + curtido + refresco", precioPromo: 6.49, precioAnterior: 9.00, descuento: 28, categoria: "Combos en Oferta", img: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400" },
    { nombrePromo: "Paquete Familiar 4 personas", descripcion: "12 pupusas surtidas + 4 horchatas + curtido extra", precioPromo: 12.99, precioAnterior: 18.00, descuento: 28, categoria: "Paquete Familiar", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400" },
    { nombrePromo: "Paquete Familiar Parrilla", descripcion: "Carne asada + pollo + chorizo + tortillas + ensalada para 4", precioPromo: 24.99, precioAnterior: 35.00, descuento: 29, categoria: "Paquete Familiar", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400" },
    { nombrePromo: "Sábado de Mariscos", descripcion: "Cóctel de camarones + ceviche + 2 cervezas", precioPromo: 14.99, precioAnterior: 22.00, descuento: 32, categoria: "Fin de Semana", img: "https://images.unsplash.com/photo-1565680018093-ebb6e51e9d38?w=400" },
    { nombrePromo: "Domingo Familiar", descripcion: "Sopa de gallina + arroz + tortillas + postre para 2", precioPromo: 10.99, precioAnterior: 15.00, descuento: 27, categoria: "Fin de Semana", img: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400" },
    { nombrePromo: "2x1 Cervezas Nacionales", descripcion: "Todas las cervezas nacionales al 2x1 de 4pm a 7pm", precioPromo: 2.00, precioAnterior: 4.00, descuento: 50, categoria: "Hora Feliz", img: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400" },
    { nombrePromo: "Chaparro + Boquitas", descripcion: "Chaparro artesanal + plato de boquitas surtidas", precioPromo: 6.99, precioAnterior: 10.50, descuento: 33, categoria: "Hora Feliz", img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400" }
];

function renderizarPromos(promos) {
    promos.forEach((promo) => {
        const id = promo.id || promo.nombrePromo;
        let contenedorId = "";

        if (promo.categoria === "Combos" || promo.categoria === "Combos en Oferta") {
            contenedorId = "lista-Combos";
        } else if (promo.categoria === "Paquete Familiar" || promo.categoria === "Familiar") {
            contenedorId = "lista-Familiar";
        } else if (promo.categoria === "Fin de Semana") {
            contenedorId = "lista-FinSemana";
        } else if (promo.categoria === "Hora Feliz") {
            contenedorId = "lista-HoraFeliz";
        }

        if (contenedorId) {
            const contenedor = document.getElementById(contenedorId);

            if (contenedor) {
                const etiquetaDescuento = promo.descuento 
                    ? `<div class="porcentaje-descuento"><p>${promo.descuento}% OFF</p></div>` 
                    : '';

                const precioActual = parseFloat(promo.precioPromo).toFixed(2);
                const precioViejo = parseFloat(promo.precioAnterior).toFixed(2);

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
}

async function cargarPromociones() {
    try {
        const { db } = await import('../service/firebase.js');
        const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js");

        const querySnapshot = await getDocs(collection(db, "promociones"));
        const promos = [];

        querySnapshot.forEach((doc) => {
            promos.push({ id: doc.id, ...doc.data() });
        });

        if (promos.length === 0) {
            renderizarPromos(promosTest);
        } else {
            renderizarPromos(promos);
        }

    } catch (error) {
        console.warn("Firebase no disponible, cargando data de prueba...", error);
        renderizarPromos(promosTest);
    }
}

window.addEventListener('DOMContentLoaded', cargarPromociones);

window.agregarAlCarrito = (nombre, precio) => {
    alert(`Agregaste "${nombre}" al carrito por tan solo $${precio}`);
};
