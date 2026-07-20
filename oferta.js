import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

const contenedor = document.getElementById("producto");

if (!id) {

    contenedor.innerHTML = "<h2>❌ Oferta no encontrada.</h2>";

} else {

    const documento = await getDoc(doc(db, "ofertas", id));

    if (!documento.exists()) {

        contenedor.innerHTML = "<h2>❌ Esta oferta ya no está disponible.</h2>";

    } else {

        const oferta = documento.data();

        contenedor.innerHTML = `
            <h1>${oferta.nombre}</h1>

            <img src="${oferta.imagen}" style="max-width:350px;width:100%;border-radius:12px;">

            <h2>$${oferta.precio}</h2>

            <p><del>$${oferta.antes}</del></p>

            <p>💰 Ahorras ${oferta.ahorro}</p>

            <a href="${oferta.enlace}" target="_blank">
                🔥 Comprar en Amazon
            </a>
        `;
    }

}
