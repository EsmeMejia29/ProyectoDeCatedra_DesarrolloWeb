import { db, auth } from '../service/firebase.js';
import {
    collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc, setDoc, query, orderBy
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import {
    createUserWithEmailAndPassword, signOut, getAuth
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

// Referencias DOM
const formProducto = document.getElementById('formProducto');
const tablaProductos = document.getElementById('tablaProductosBody');
const formEmpleado = document.getElementById('formEmpleado');
const btnCancelar = document.getElementById('btnCancelarEdit');

let editStatus = false;
let idEditar = '';

//crud del menú
const q = query(collection(db, "productos"), orderBy("categoria"));
onSnapshot(q, (snapshot) => {
    let html = '';
    snapshot.docs.forEach(doc => {
        const prod = doc.data();
        html += `
            <tr>
                <td><img src="${prod.imagen || '../img/logoSaborSalvadorenno.png'}" width="40" class="rounded"></td>
                <td>${prod.nombre}</td>
                <td>$${prod.precio}</td>
                <td><span class="badge bg-light text-dark border">${prod.categoria}</span></td>
                <td>
                    <button class="btn btn-sm btn-info btn-editar" data-id="${doc.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${doc.id}"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    tablaProductos.innerHTML = html;
    asignarEventosDinamicos();
});

// CREAR Y ACTUALIZAR PRODUCTOS
formProducto.addEventListener('submit', async (e) => {
    e.preventDefault();

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
            alert("Producto agregado correctamente");
        } else {
            await updateDoc(doc(db, "productos", idEditar), {
                nombre, precio, categoria, descripcion, imagen
            });
            alert("Producto actualizado");
            editStatus = false;
            idEditar = '';
            document.getElementById('btnGuardarProd').innerText = 'Guardar Producto';
            btnCancelar.classList.add('d-none');
        }
        formProducto.reset();
    } catch (error) {
        console.error(error);
        alert("Error al guardar");
    }
});

function asignarEventosDinamicos() {
    // Eliminar producto
    const btnsEliminar = document.querySelectorAll('.btn-eliminar');
    btnsEliminar.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            // subimos en el DOM hasta encontrar el botón por si clickean el ícono
            const id = e.currentTarget.dataset.id;
            if (confirm("¿Estás seguro de eliminar este platillo?")) {
                await deleteDoc(doc(db, "productos", id));
            }
        });
    });

    // Editar producto
    const btnsEditar = document.querySelectorAll('.btn-editar');
    btnsEditar.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            editStatus = true;
            idEditar = id;
            document.getElementById('btnGuardarProd').innerText = 'Actualizar';
            btnCancelar.classList.remove('d-none');
            alert("Función de cargar datos en formulario lista para implementar");
        });
    });
}

btnCancelar.addEventListener('click', () => {
    editStatus = false;
    idEditar = '';
    formProducto.reset();
    document.getElementById('btnGuardarProd').innerText = 'Guardar Producto';
    btnCancelar.classList.add('d-none');
});


// crud de empleados

formEmpleado.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Capturar los datos del formulario HTML actualizado
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

        // Inicializar app secundaria
        const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
        const secondaryAuth = getAuth(secondaryApp);

        // 2. Crear el usuario en Authentication
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);

        // 3. Guardar los datos en Firestore 
        await setDoc(doc(db, "usuarios", userCredential.user.uid), {
            nombre: nombre,
            email: email,
            role: "Empleado"
        });
        await signOut(secondaryAuth);

        // Feedback al usuario
        alert(`Empleado ${nombre} creado exitosamente.`);
        formEmpleado.reset();
        // por si las moscas que se oculte el formulario de nuevo
        document.getElementById('formEmpleadoContainer').classList.add('d-none');
        document.getElementById('addEmployeeBtn').innerHTML = `<i class="fas fa-user-plus me-2"></i>Mostrar Formulario`;

    } catch (error) {
        console.error("Error creando empleado:", error);
        let msg = error.message;
        if (error.code === 'auth/email-already-in-use') msg = "Este correo ya está registrado.";
        if (error.code === 'auth/weak-password') msg = "La contraseña debe tener al menos 6 caracteres.";
        alert("Error: " + msg);
    }
});
