import { auth, db, doc, getDoc } from '../service/firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.role !== 'Gerente') {
                alert("Acceso denegado. Redirigiendo...");
                window.location.href = '../index.html';
            }
            // Si es gerente, dejamos que cargue la página
            document.body.style.display = "block";
        } else {
            window.location.href = '../login.html';
        }
    } else {
        window.location.href = '../login.html';
    }
});
