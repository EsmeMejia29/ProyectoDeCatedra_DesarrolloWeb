import { db } from '../service/firebase.js';
import {
    collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc, setDoc, query, orderBy, where
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import {
    createUserWithEmailAndPassword, signOut, getAuth
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

// DOM
const formProducto = document.getElementById('formProducto');
const gridProductos = document.getElementById('gridProductos'); 
const formEmpleado = document.getElementById('formEmpleado');
const btnCancelar = document.getElementById('btnCancelarEdit');
const statEmpleados = document.getElementById('statEmpleados');

let editStatus = false;
let idEditar = '';
let chartInstance = null;

// segun categoria la cantidad de productos
const qEmpleados = query(collection(db, "usuarios"), where("role", "==", "Empleado"));
onSnapshot(qEmpleados, (snapshot) => {
    if (statEmpleados) statEmpleados.innerText = snapshot.size;
});

//menuuuu con tarjetitas
const qProductos = query(collection(db, "productos"), orderBy("categoria"));

onSnapshot(qProductos, (snapshot) => {
    let html = '';
    let contadores = {
        total: 0, Pupusas: 0, Entradas: 0, "Platos Principales": 0, Postres: 0, Bebidas: 0
    };

    snapshot.docs.forEach(doc => {
        const prod = doc.data();

        // Contadores
        contadores.total++;
        if (contadores.hasOwnProperty(prod.categoria)) contadores[prod.categoria]++;

        html += `
            <div class="col-12 col-md-6 col-xl-4">
                <div class="card h-100 shadow-sm border-0 card-producto">
                    <div class="position-relative">
                        <img src="${prod.imagen || '../img/logoSaborSalvadorenno.png'}" class="card-img-top" alt="${prod.nombre}" style="height: 160px; object-fit: cover;">
                        <span class="badge bg-light text-dark position-absolute top-0 start-0 m-2 border shadow-sm">
                            ${prod.categoria}
                        </span>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="card-title fw-bold mb-0 text-dark">${prod.nombre}</h6>
                            <span class="text-naranja fw-bold">$${parseFloat(prod.precio).toFixed(2)}</span>
                        </div>
                        <p class="card-text small text-muted flex-grow-1" style="font-size: 0.85rem;">
                            ${prod.descripcion ? prod.descripcion.substring(0, 60) + '...' : 'Sin descripción'}
                        </p>
                        <div class="d-flex gap-2 mt-3 pt-3 border-top">
                            <button class="btn btn-sm btn-outline-naranja flex-grow-1 btn-editar" data-id="${doc.id}">
                                <i class="fas fa-edit me-1"></i>Editar
                            </button>
                            <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${doc.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    if (gridProductos) gridProductos.innerHTML = html;

    actualizarEstadisticasProductos(contadores);
    renderizarGrafica(contadores);
    asignarEventosDinamicos();
});

function actualizarEstadisticasProductos(c) {
    const setText = (id, val) => { if (document.getElementById(id)) document.getElementById(id).innerText = val; };
    setText('statTotal', c.total);
    setText('statPupusas', c.Pupusas);
    setText('statBebidas', c.Bebidas);
    setText('statPostres', c.Postres);
    setText('statEntradas', c.Entradas);
    setText('statPrincipales', c["Platos Principales"]);
}

function renderizarGrafica(datos) {
    const ctx = document.getElementById('graficoCategorias');
    if (!ctx) return;

    if (chartInstance) { chartInstance.destroy(); }

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pupusas', 'Entradas', 'Platos Fuertes', 'Postres', 'Bebidas'],
            datasets: [{
                data: [datos.Pupusas, datos.Entradas, datos["Platos Principales"], datos.Postres, datos.Bebidas],
                backgroundColor: ['#fa7315', '#ef4444', '#fcd34d', '#3b82f6', '#10b981'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { font: { family: "'Poppins', sans-serif", size: 12 }, usePointStyle: true, padding: 15 } }
            },
            layout: { padding: 10 }
        }
    });
}
if (formProducto) {
    formProducto.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('prodNombre').value;
        const precio = document.getElementById('prodPrecio').value;
        const categoria = document.getElementById('prodCategoria').value;
        const descripcion = document.getElementById('prodDesc').value;
        const imagen = document.getElementById('prodImg').value;

        try {
            if (!editStatus) {
                await addDoc(collection(db, "productos"), { nombre, precio, categoria, descripcion, imagen });
                alert("Producto agregado exitosamente.");
            } else {
                await updateDoc(doc(db, "productos", idEditar), { nombre, precio, categoria, descripcion, imagen });
                alert("Producto actualizado.");
                resetForm();
            }
            formProducto.reset();
        } catch (error) {
            console.error("Error:", error);
            alert("Error al guardar.");
        }
    });
}

function asignarEventosDinamicos() {
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            if (confirm("¿Eliminar este platillo?")) await deleteDoc(doc(db, "productos", id));
        });
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            editStatus = true;
            idEditar = id;
            const btnGuardar = document.getElementById('btnGuardarProd');
            if (btnGuardar) {
                btnGuardar.innerText = 'Actualizar';
                btnGuardar.classList.remove('btn-success');
                btnGuardar.classList.add('btn-primary');
            }
            if (btnCancelar) btnCancelar.classList.remove('d-none');

            // desocultar el formulario
            const container = document.getElementById('formProductoContainer');
            if (container && container.classList.contains('d-none')) {
                container.classList.remove('d-none');
            }
            formProducto.scrollIntoView({ behavior: 'smooth', block: 'center' });

            alert("Modo edición activado.");
        });
    });
}

if (btnCancelar) btnCancelar.addEventListener('click', resetForm);

function resetForm() {
    editStatus = false;
    idEditar = '';
    formProducto.reset();
    const btnGuardar = document.getElementById('btnGuardarProd');
    if (btnGuardar) btnGuardar.innerText = 'Guardar';
    if (btnCancelar) btnCancelar.classList.add('d-none');
}

// para registrar los pelones
if (formEmpleado) {
    formEmpleado.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('empNombre').value;
        const email = document.getElementById('empEmail').value;
        const password = document.getElementById('empPassword').value;
        const rol = document.getElementById('empRole').value;

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
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);

            await setDoc(doc(db, "usuarios", userCredential.user.uid), {
                nombre: nombre, email: email, role: rol
            });
            await signOut(secondaryAuth);

            alert(`Usuario ${nombre} (${rol}) creado.`);
            formEmpleado.reset();
        } catch (error) {
            console.error("Error registro:", error);
            alert("Error: " + error.message);
        }
    });
}
