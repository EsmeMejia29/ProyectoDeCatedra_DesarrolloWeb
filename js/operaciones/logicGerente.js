import { db } from '../service/firebase.js';
import {
    collection, onSnapshot, doc, setDoc, query
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import {
    createUserWithEmailAndPassword, signOut, getAuth
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
let chartInstance = null;
// Buscamos la etiqueta donde va el numero
const statEmpleados = document.getElementById('statEmpleados');

// Consultamos la base de datos de usuarios
const qEmpleados = query(collection(db, "usuarios"));
onSnapshot(qEmpleados, (snapshot) => {
    if (statEmpleados) {
        statEmpleados.innerText = snapshot.size;
    }
});
const qProductos = collection(db, "menu");
onSnapshot(qProductos, (snapshot) => {
    const productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Llamamos a la funcion que hace los calculos
    actualizarDashboard(productos);
});

// Funcion para contar y actualizar la pantalla
function actualizarDashboard(productos) {
    let contadores = {
        total: 0,
        Pupusas: 0,
        Entradas: 0,
        "Platos Principales": 0,
        Postres: 0,
        Bebidas: 0
    };

    // Revisamos cada producto uno por uno
    productos.forEach(prod => {
        contadores.total++;
        // Si la categoria del producto existe en nuestros contadores, sumamos 1
        if (contadores.hasOwnProperty(prod.categoria)) {
            contadores[prod.categoria]++;
        }
    });
    const setText = (id, val) => {
        if (document.getElementById(id)) {
            document.getElementById(id).innerText = val;
        }
    };

    // Ponemos los numeros en las tarjetas de arriba
    setText('statTotal', contadores.total);
    setText('statPupusas', contadores.Pupusas);
    setText('statBebidas', contadores.Bebidas);
    setText('statPostres', contadores.Postres);
    setText('statEntradas', contadores.Entradas);
    setText('statPrincipales', contadores["Platos Principales"]);
    renderizarGrafica(contadores);
}

// Funcion para dibujar el grafico de pastele
function renderizarGrafica(datos) {
    const ctx = document.getElementById('graficoCategorias');

    // Si no hay donde dibujar, get out nig
    if (!ctx) return;

    // Si ya habia un grafico, lo borramos para no encimar
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pupusas', 'Entradas', 'Platos Fuertes', 'Postres', 'Bebidas'],
            datasets: [{
                data: [
                    datos.Pupusas,
                    datos.Entradas,
                    datos["Platos Principales"],
                    datos.Postres,
                    datos.Bebidas
                ],
                backgroundColor: ['#fa7315', '#ef4444', '#fcd34d', '#3b82f6', '#10b981'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: { family: "'Poppins', sans-serif", size: 12 },
                        usePointStyle: true,
                        padding: 15
                    }
                }
            },
            layout: { padding: 10 }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const btnMostrarRRHH = document.getElementById('btnAddEmpleado');

    if (btnMostrarRRHH) {
        btnMostrarRRHH.addEventListener('click', desplegarFormularioEmpleado);
    }
});

function desplegarFormularioEmpleado() {
    const container = document.querySelector("#empleadoFormulario");
    container.innerHTML = `
    <form id="formRegistroEmpleado" onsubmit="return false">
        
        <div class="mb-3">
            <label for="empNombre" class="form-label">Nombre Completo</label>
            <input type="text" class="form-control" id="empNombre" placeholder="Nombre del empleado" required>
        </div>

        <div class="mb-3">
            <label for="empEmail" class="form-label">Correo Electrónico</label>
            <input type="email" class="form-control" id="empEmail" placeholder="empleado@correo.com" required>
        </div>

        <div class="mb-3">
            <label for="empPassword" class="form-label">Contraseña</label>
            <input type="password" class="form-control" id="empPassword" placeholder="Mínimo 6 caracteres" required>
        </div>

        <div class="mb-3">
            <label for="empRole" class="form-label">Rol Asignado</label>
            <select class="form-select" id="empRole">
                <option value="Empleado" selected>Empleado</option>
                <option value="Gerente">Gerente</option>
            </select>
        </div>

        <button type="button" class="btn btn-secondary" id="btnCancelarEmp">Cancelar</button>
        
        <button type="button" class="btn btn-primary" id="btnGuardarEmp" style="background-color: orange; border: none;">Registrar</button>
    </form>
    `;
    document.getElementById('btnCancelarEmp').addEventListener('click', () => {
        container.innerHTML = "";
    });
    document.getElementById('btnGuardarEmp').addEventListener('click', registrarEmpleado);
}

// Funcion para guardar el empleado en la base de datos
async function registrarEmpleado() {
    const nombre = document.getElementById('empNombre').value;
    const email = document.getElementById('empEmail').value;
    const password = document.getElementById('empPassword').value;
    const rol = document.getElementById('empRole').value;

    // Validacion
    if (!nombre || !email || !password) {
        alert("Por favor completa todos los campos.");
        return;
    }

    try {
        const firebaseConfig = {
            apiKey: "AIzaSyDmYYGRmUDEOtgbiO37l0hNfbZ0shC3cB0",
            authDomain: "gestionrestaurante-99b84.firebaseapp.com",
            projectId: "gestionrestaurante-99b84",
            storageBucket: "gestionrestaurante-99b84.firebasestorage.app",
            messagingSenderId: "436759352562",
            appId: "1:436759352562:web:5fe3e2fe0631ad38f1ac6b",
            measurementId: "G-E5D6H214L9"
        };
        const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
        const secondaryAuth = getAuth(secondaryApp);

        // Creamos el usuario en el sistema de autenticacion
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);

        // Guardamos el nombre y el rol en la base de datos. La firestore
        await setDoc(doc(db, "usuarios", userCredential.user.uid), {
            nombre: nombre,
            email: email,
            role: rol
        });

        // Cerramos la sesion de la app secundaria 
        await signOut(secondaryAuth);

        // Mensaje de exito
        alert(`Usuario ${nombre} creado exitosamente con el rol de ${rol}.`);

        // Borramos el formulario
        document.querySelector("#empleadoFormulario").innerHTML = "";

    } catch (error) {
        console.error("Error registro:", error);
        alert("Error al crear usuario: " + error.message);
    }
}
