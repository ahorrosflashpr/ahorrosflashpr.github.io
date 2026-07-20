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

<div class="oferta-individual">

    <img src="${oferta.imagen}" alt="${oferta.nombre}">

    <h1>${oferta.nombre}</h1>

    <div class="precio-grande">
        $${oferta.precio}
    </div>

    <div class="antes">
        Antes: $${oferta.antes}
    </div>

    <p style="font-size:22px;font-weight:bold;">
        💰 Ahorras ${oferta.ahorro}
    </p>

    ${
        oferta.tipoDescuento === "codigo"
        ? `<div class="btn-codigo btn-codigo-color">
            📋 Código: ${oferta.codigo}
           </div>`
        : oferta.tipoDescuento === "cupon"
        ? `<div class="btn-codigo btn-cupon">
            🎟 Activa el cupón en Amazon
           </div>`
        : `<div class="btn-codigo btn-precio">
            💰 Bajo precio
           </div>`
    }

    <a
        class="btn-amazon"
        href="${oferta.enlace}"
        target="_blank">

        🔥 VER OFERTA EN AMAZON

    </a>

</div>

`;
    }

}
