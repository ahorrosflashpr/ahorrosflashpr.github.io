import { db } from "../firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
const formulario = document.getElementById("formOferta");
const tbody = document.querySelector("#tablaOfertas tbody");

// Cargar ofertas al abrir la página
async function cargarOfertas() {

    tbody.innerHTML = "";

    const consulta = await getDocs(collection(db, "ofertas"));

    consulta.forEach((documento) => {

        const oferta = documento.data();

        tbody.innerHTML += `
        <tr>
            <td>${oferta.nombre}</td>
            <td>${oferta.precio}</td>
            <td>${oferta.categoria}</td>
            <td>
                <button class="editar">✏️</button>
                <button class="eliminar">🗑️</button>
            </td>
        </tr>
        `;

    });

}

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const archivo = document.getElementById("imagen").files[0];

        await addDoc(collection(db, "ofertas"), {

            nombre: document.getElementById("nombre").value,
            precio: document.getElementById("precio").value,
            antes: document.getElementById("antes").value,
            descuento: document.getElementById("descuento").value,
            ahorro: document.getElementById("ahorro").value,
            categoria: document.getElementById("categoria").value,
            enlace: document.getElementById("enlace").value,
            imagen: archivo ? "images/" + archivo.name : ""

        });

        alert("✅ Oferta publicada");

        formulario.reset();

        cargarOfertas();

    } catch (error) {

        console.error(error);

        alert("❌ Error al guardar la oferta");

    }

});

cargarOfertas();

cargarOfertas();
