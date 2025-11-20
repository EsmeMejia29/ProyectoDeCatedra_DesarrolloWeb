import { auth } from './service/firebase.js';
import { signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Función principal para cerrar sesión
function cerrarSesion() {
    signOut(auth)
        .then(() => {
            // Cierre de sesión exitoso
            
            // Limpiar cualquier dato de sesión local 
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            
            // Redirigir al usuario a la página de inicio de sesión
            window.location.href = '../login.html'; 
        })
        .catch((error) => {
            // Ocurrió un error al cerrar sesión
            console.error("Error al cerrar sesión:", error);
            alert("No se pudo cerrar la sesión correctamente. Inténtalo de nuevo.");
        });
}


// añadir event listener
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutBtn');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', cerrarSesion);
    } else {
        console.error("No se encontró el botón de cierre de sesión con el ID 'logoutBtn'");
    }
});

// Exportar la función
export { cerrarSesion };