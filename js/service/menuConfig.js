import {db} from '../../js/service/firebase.js';
import { addDoc ,  collection, serverTimestamp, query, getDocs, getDoc, updateDoc, 
deleteDoc, orderBy, doc 
} from 'https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js';

const COLECCION ='menu';

export async function obtenerPlatosMenu(){
    try{
        const consulta = query(
            collection(db, COLECCION),
            orderBy('createdAt', 'desc')
        );

        const obtenerPlatos = await getDocs(consulta);
        const verPlatos = [];
        obtenerPlatos.forEach(doc => verPlatos.push({
            id: doc.id, 
            ...doc.data()
        }));

        return {data: verPlatos};
    }
    catch(error){
        return {error:error.message};
    }
}

export async function agregarPlato(platoNuevo){
    try{
        const agregarPlato = await addDoc(collection(db, COLECCION), {
            ...platoNuevo,
            createdAt: serverTimestamp()
        });

        return {id: agregarPlato.id};
    }

    catch(error){
        return {error:error.message};
    }
}

export async function modificarPlato(platoId, platoInfo){
    try {
        const platoRef = doc(db, COLECCION, platoId);
        await updateDoc(platoRef, {
            ...platoInfo,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch(error) {
        return { error: error.message };
    }
}

export async function eliminarPlato(platoId){
    try{
        const eliminarPlato = doc(db, COLECCION, platoId);
        await deleteDoc(eliminarPlato);
    }
    catch(error){
        return {error:error.message};
    }
}