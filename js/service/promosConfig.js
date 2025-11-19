import {db} from '../../js/service/firebase.js';
import { addDoc ,  collection, serverTimestamp, query, getDocs, getDoc, updateDoc, 
deleteDoc, orderBy, doc 
} from 'https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js';

const COLECCION ='promociones';

export async function obtenerPromos(){
    try{
        const consulta = query(
            collection(db, COLECCION),
            orderBy('createdAt', 'desc')
        );

        const obtenerPromos = await getDocs(consulta);
        const verPromos = [];
        obtenerPromos.forEach(doc => verPromos.push({
            id: doc.id, 
            ...doc.data()
        }));
        return {data: verPromos};
    }

    catch(error){
        return {error:error.message};
    }
}

export async function agregarPromo(promoNueva){
    try{
        const agregarPromo = await addDoc(collection(db, COLECCION), {
            ...promoNueva,
            createdAt: serverTimestamp()
        });
        return {id: agregarPromo.id};
    }

    catch(error){
        return {error:error.message};
    }
}

export async function modificarPromo(promoId, promoInfo){
    try {
        const promoRef = doc(db, COLECCION, promoId);
        await updateDoc(promoRef, {
            ...promoInfo,
            updatedAt: serverTimestamp()
        });
    } catch(error) {
        return { error: error.message };
    }
}

export async function eliminarPromo(promoId){
    try{
        const eliminarPromo = doc(db, COLECCION, promoId);
        await deleteDoc(eliminarPromo);
    }
    catch(error){
        return {error:error.message};
    }
}