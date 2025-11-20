import { db } from '../service/firebase.js';
import {
    collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc, setDoc, query, orderBy, where
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import {
    createUserWithEmailAndPassword, signOut, getAuth
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

const formProducto = document.getElementById('formProducto');
const tablaProductos = document.getElementById('tablaProductosBody');
const formEmpleado = document.getElementById('formEmpleado');
const btnCancelar = document.getElementById('btnCancelarEdit');
const statEmpleados = document.getElementById('statEmpleados');
let editStatus = false;
let idEditar = '';

const qEmpleados = query(collection(db, "usuarios"), where("role", "==", "Empleado"));

onSnapshot(qEmpleados, (snapshot) => {
    if (statEmpleados) {
        statEmpleados.innerText = snapshot.size;
    }
});

const qProductos = query(collection(db, "productos"), orderBy("categoria"));

onSnapshot(qProductos, (snapshot) => {
    let html = '';
    let contadores = {
        total: 0, Pupusas: 0, Entradas: 0, "Platos Principales": 0, Postres: 0, Bebidas: 0
    };

    snapshot.docs.forEach(doc => {
        const prod = doc.data();
        contadores.total++;
        if (contadores.hasOwnProperty(prod.categoria)) {
            contadores[prod.categoria]++;
        }

        //fila de la tabla
        html += `
            <tr>
                <td><img src="${prod.imagen || '../img/logoSaborSalvadorenno.png'}" width="40" class="rounded shadow-sm" alt="img"></td>
                <td class="fw-bold text-dark">${prod.nombre}</td>
                <td class="text-muted">$${parseFloat(prod.precio).toFixed(2)}</td>
                <td><span class="badge rounded-pill bg-light text-dark border">${prod.categoria}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary btn-editar border-0" data-id="${doc.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-eliminar border-0" data-id="${doc.id}" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    if (tablaProductos) tablaProductos.innerHTML = html;
    actualizarEstadisticasProductos(contadores);
    asignarEventosDinamicos();
});

// Función auxiliar para actualizar los textos de las tarjetas
function actualizarEstadisticasProductos(c) {
    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    };
    setText('statTotal', c.total);
    setText('statPupusas', c.Pupusas);
    setText('statBebidas', c.Bebidas);
    setText('statPostres', c.Postres);
    setText('statEntradas', c.Entradas);
    setText('statPrincipales', c["Platos Principales"]);
}
if (formProducto) {
    formProducto.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Captura de datos
        const nombre = document.getElementById('prodNombre').value;
        const precio = document.getElementById('prodPrecio').value;
        const categoria = document.getElementById('prodCategoria').value;
        const descripcion = document.getElementById('prodDesc').value;
        const imagen = document.getElementById('prodImg').value;

        try {
            if (!editStatus) {
                await addDoc(collection(db, "productos"), {
                    nombre, precio, categoria, descripcion, imagen
                });
                alert("Producto agregado exitosamente.");
            } else {
                await updateDoc(doc(db, "productos", idEditar), {
                    nombre, precio, categoria, descripcion, imagen
                });
                alert("Producto actualizado correctamente.");
                resetForm();
            }
            formProducto.reset();
        } catch (error) {
            console.error("Error menú:", error);
            alert("Ocurrió un error al guardar el producto.");
        }
    });
}
function asignarEventosDinamicos() {
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            if (confirm("¿Estás seguro de eliminar este platillo?")) {
                await deleteDoc(doc(db, "productos", id));
            }
        });
    });

    // Botón Editar 
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            editStatus = true;
            idEditar = id;
            const btnGuardar = document.getElementById('btnGuardarProd');
            if (btnGuardar) {
                btnGuardar.innerText = 'Actualizar';
                btnGuardar.classList.replace('btn-success', 'btn-warning');
            }
            if (btnCancelar) btnCancelar.classList.remove('d-none');

            // Asegurar que el formulario sea visible 
            const container = document.getElementById('formProductoContainer');
            if (container && container.classList.contains('d-none')) {
                container.classList.remove('d-none');
            }
            formProducto.scrollIntoView({ behavior: 'smooth', block: 'center' });
            alert("Modo edición activado. (Ingresa los nuevos datos en el formulario)");
        });
    });
}

// Botón Cancelar Edición
if (btnCancelar) {
    btnCancelar.addEventListener('click', resetForm);
}

function resetForm() {
    editStatus = false;
    idEditar = '';
    formProducto.reset();
    const btnGuardar = document.getElementById('btnGuardarProd');
    if (btnGuardar) {
        btnGuardar.innerText = 'Guardar';
        btnGuardar.classList.replace('btn-warning', 'btn-success');
    }
    if (btnCancelar) btnCancelar.classList.add('d-none');
}

if (formEmpleado) {
    formEmpleado.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('empNombre').value;
        const email = document.getElementById('empEmail').value;
        const password = document.getElementById('empPassword').value;

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

            //crear un usuario nuevo 
            const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
            const secondaryAuth = getAuth(secondaryApp);

            //Crear usuario en Auth
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);

            //Guardar datos y rol en Firestore 
            await setDoc(doc(db, "usuarios", userCredential.user.uid), {
                nombre: nombre,
                email: email,
                role: "Empleado"
            });

            //Cerrar sesión
            await signOut(secondaryAuth);

            alert(`¡Empleado ${nombre} registrado exitosamente!`);
            formEmpleado.reset();

        } catch (error) {
            console.error("Error creando empleado:", error);
            let msg = error.message;
            if (error.code === 'auth/email-already-in-use') msg = "El correo ya está registrado.";
            if (error.code === 'auth/weak-password') msg = "La contraseña debe tener al menos 6 caracteres.";
            alert("Error: " + msg);
        }
    });
}
