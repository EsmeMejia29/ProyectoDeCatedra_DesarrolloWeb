// js/login.js

import { auth, db, signInWithEmailAndPassword, doc, getDoc } from './service/firebase.js';


document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('contrasena').value;

    try {
        // 1. Iniciar sesión con Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Obtener el rol desde Firestore
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));

        if (!userDoc.exists()) {
            alert('Usuario no encontrado en la base de datos. Contacte al administrador.');
            return;
        }

        const userData = userDoc.data();
        const role = userData.role;

        if (role !== 'Gerente' && role !== 'Empleado') {
            alert('Rol no autorizado.');
            return;
        }

        // 3. Guardar datos en localStorage (opcional, para persistencia)
        localStorage.setItem('userRole', role);
        localStorage.setItem('userId', user.uid);

        // 4. Redirigir según el rol
        if (role === 'Gerente') {
            window.location.href = 'admin/gerente.html'
        } else {
            window.location.href = 'admin/empleado.html';
        }

    } catch (error) {
        console.error('Error de login:', error);
        let message = 'Error al iniciar sesión. ';

        switch (error.code) {
            case 'auth/invalid-credential':
                message += 'Correo o contraseña incorrectos.';
                break;
            case 'auth/user-not-found':
                message += 'Usuario no registrado.';
                break;
            case 'auth/wrong-password':
                message += 'Contraseña incorrecta.';
                break;
            default:
                message += 'Inténtalo de nuevo.';
        }
        alert(message);
    }
});