import { db } from "../firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    getDoc,
    updateDoc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const formulario = document.getElementById("formOferta");
const tbody = document.querySelector("#tablaOfertas tbody");

let editando = null;

// ===============================
// Cargar ofertas
// ===============================
async function cargarOfertas() {

    tbody.innerHTML = "";

    // Temporalmente quitamos el orden por fecha
    const consulta = await getDocs(collection(db, "ofertas"));

    document.getElementById("totalOfertas").textContent =
        `📦 ${consulta.size} ofertas publicadas`;

    consulta.forEach((documento) => {

        const oferta = documento.data();

    tbody.innerHTML += `
<tr>

    <td>
        <img
            src="${oferta.imagen}"
            class="miniatura"
            alt="${oferta.nombre}">
    </td>

    <td>${oferta.nombre}</td>

    <td>$${oferta.precio}</td>

    <td>
        <button class="editar" data-id="${documento.id}">✏️</button>
        <button class="eliminar" data-id="${documento.id}">🗑️</button>
    </td>

</tr>
`;

    });

    // ===============================
    // BOTONES EDITAR
    // ===============================

    document.querySelectorAll(".editar").forEach((boton) => {

        boton.addEventListener("click", async () => {

            const documento = await getDoc(doc(db, "ofertas", boton.dataset.id));

            const oferta = documento.data();

            document.getElementById("nombre").value = oferta.nombre;
            document.getElementById("precio").value = oferta.precio;
            document.getElementById("antes").value = oferta.antes;
            document.getElementById("enlace").value = oferta.enlace;
            document.getElementById("imagen").value =
                oferta.imagen.replace("images/", "");
            document.getElementById("codigo").value = oferta.codigo || "";
            document.getElementById("estado").value =
    oferta.estado || "activa";

            editando = boton.dataset.id;

            formulario.querySelector("button").textContent =
                "💾 GUARDAR CAMBIOS";

        });

    });

    // ===============================
    // BOTONES ELIMINAR
    // ===============================

    document.querySelectorAll(".eliminar").forEach((boton) => {

        boton.addEventListener("click", async () => {

            if (!confirm("¿Eliminar esta oferta?")) return;

            await deleteDoc(doc(db, "ofertas", boton.dataset.id));

            cargarOfertas();

        });

    });

}

// ===============================
// Guardar / Editar
// ===============================
formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        // 👇 PEGA EL CÓDIGO AQUÍ

        const precio = Number(document.getElementById("precio").value);
        const antes = Number(document.getElementById("antes").value);

        const descuento = Math.round(((antes - precio) / antes) * 100);
        const ahorro = (antes - precio).toFixed(2);

        console.log(precio, antes, descuento, ahorro);

        //

if (editando) {

    await updateDoc(doc(db, "ofertas", editando), {

    nombre: document.getElementById("nombre").value,
    precio: precio.toFixed(2),
    antes: antes.toFixed(2),
    descuento: descuento + "%",
    ahorro: "$" + ahorro,
    enlace: document.getElementById("enlace").value,
    imagen: "images/" + document.getElementById("imagen").value,
    codigo: document.getElementById("codigo").value,
    estado: document.getElementById("estado").value

    fecha: Date.now()

});

    alert("✅ Oferta actualizada");

    editando = null;

    formulario.querySelector("button").textContent = "🚀 PUBLICAR OFERTA";

} else {

    console.log("Guardando fecha:", Date.now());
    
    await addDoc(collection(db, "ofertas"), {

    nombre: document.getElementById("nombre").value,
    precio: precio.toFixed(2),
    antes: antes.toFixed(2),
    descuento: descuento + "%",
    ahorro: "$" + ahorro,
    enlace: document.getElementById("enlace").value,
    imagen: "images/" + document.getElementById("imagen").value,
    codigo: document.getElementById("codigo").value,
    estado: document.getElementById("estado").value,

    fecha: Date.now()

});

    alert("✅ Oferta publicada");

}

        formulario.reset();

        cargarOfertas();

    } catch (error) {

        console.error(error);

        alert("❌ Error");

    }

});

// ===============================
// Iniciar
// ===============================
cargarOfertas();
