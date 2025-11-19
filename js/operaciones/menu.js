import {obtenerPlatosMenu, obtenerPlatosMenuId, agregarPlato, 
    modificarPlato, eliminarPlato
} from '../service/menuConfig.js';

document.addEventListener("DOMContentLoaded", () => {
    displayMenu();
});

async function displayMenu() {
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
                        <p class="card-text">${producto.descripcion}</p>
                        <p class="card-text-precio">Precio: ${producto.precio}</p>
                        <a href="#" class="btn btn-primary edit"><i class="fa-regular fa-pen-to-square"></i></a>
                        <a href="#" class="btn btn-primary delete"><i class="fa-regular fa-trash-can"></i></a>
                    </div>
                </div>`
            ).join(""); 
        }
        catch (error) {
            console.error("Error mostrando menú:", error);
        }
    }