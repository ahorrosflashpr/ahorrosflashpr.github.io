import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    orderBy,
    limit
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

<div class="oferta-verificada">
    ✅ Oferta verificada por Flash PR
</div>

    ${
        oferta.tipoDescuento === "codigo"
        ? `<div class="btn-codigo btn-codigo-color">
        📋 USA EL CÓDIGO: ${oferta.codigo}
        </div>`
        : oferta.tipoDescuento === "cupon"
        : `<div class="btn-codigo btn-cupon">
        🎟 ACTIVA EL CUPÓN EN AMAZON
        </div>`
        : `<div class="btn-codigo btn-precio">
        💰 BAJO PRECIO • NO REQUIERE CUPÓN
        </div>``
    }

    <a
    class="btn-amazon"
    href="${oferta.enlace}"
    target="_blank">

    🔥 VER OFERTA EN AMAZON

</a>

<a
    href="index.html"
    class="btn-amazon"
    style="background:#2563eb;margin-top:12px;">

    ⬅️ Ver todas las ofertas

</a>

</div>

`;
    }

}

// ==============================
// OFERTAS RELACIONADAS
// ==============================

const relacionadas = document.getElementById("relacionadas");

const consulta = await getDocs(
    query(
        collection(db, "ofertas"),
        orderBy("fecha", "desc"),
        limit(4)
    )
);

consulta.forEach((documento)=>{

    if(documento.id === id) return;

    const item = documento.data();

    relacionadas.innerHTML += `

<div class="card">

    <img src="${item.imagen}" alt="${item.nombre}">

    <h2>${item.nombre}</h2>

    <div class="old">
        Antes: $${item.antes}
    </div>

    <div class="price">
        $${item.precio}
    </div>

    <div class="saving">
        💰 Ahorras ${item.ahorro}
    </div>

    ${
        item.tipoDescuento === "codigo"
        ? `<div class="btn-codigo btn-codigo-color">📋 Código: ${item.codigo}</div>`
        : item.tipoDescuento === "cupon"
        ? `<div class="btn-codigo btn-cupon">🎟 Activa el cupón</div>`
        : `<div class="btn-codigo btn-precio">💰 Bajo precio</div>`
    }

    <a class="btn-oferta" href="oferta.html?id=${documento.id}">
        👀 Ver oferta
    </a>

</div>

`;

});
