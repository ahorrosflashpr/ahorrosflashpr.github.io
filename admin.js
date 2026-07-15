import { db } from "../firebase.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const formulario = document.getElementById("formOferta");

formulario.addEventListener("submit", async (e)=>{

    e.preventDefault();

    try{

        await addDoc(collection(db,"ofertas"),{

    nombre:document.getElementById("nombre").value,

    precio:document.getElementById("precio").value,

    antes:document.getElementById("antes").value,

    descuento:document.getElementById("descuento").value,

    ahorro:document.getElementById("ahorro").value,

    categoria:document.getElementById("categoria").value,

    enlace:document.getElementById("enlace").value,

    imagen:"images/" + document.getElementById("imagen").files[0].name

});

        alert("✅ Oferta publicada");

        formulario.reset();

    }

    catch(error){

        console.log(error);

        alert("Error");

    }

});
