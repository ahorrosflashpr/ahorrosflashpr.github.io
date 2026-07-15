import { db } from "../firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const formulario = document.getElementById("formOferta");
const tbody = document.querySelector("#tablaOfertas tbody");

let editando = null;

// ===============================
// Cargar ofertas
// ===============================
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
                <button class="editar" data-id="${documento.id}">✏️</button>
                <button class="eliminar" data-id="${documento.id}">🗑️</button>
            </td>
        </tr>
        `;

    });

    // BOTONES EDITAR
    document.querySelectorAll(".editar").forEach((boton) => {

        boton.addEventListener("click", async () => {

            const documento = await getDoc(doc(db, "ofertas", boton.dataset.id));

            const oferta = documento.data();

            document.getElementById("nombre").value = oferta.nombre;
            document.getElementById("precio").value = oferta.precio;
            document.getElementById("antes").value = oferta.antes;
            document.getElementById("descuento").value = oferta.descuento;
            document.getElementById("ahorro").value = oferta.ahorro;
            document.getElementById("categoria").value = oferta.categoria;
            document.getElementById("enlace").value = oferta.enlace;

            editando = boton.dataset.id;

            formulario.querySelector("button").textContent = "💾 GUARDAR CAMBIOS";

        });

    });

    // BOTONES ELIMINAR
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


        if (editando) {

            await updateDoc(doc(db, "ofertas", editando), {

                nombre: document.getElementById("nombre").value,
                precio: document.getElementById("precio").value,
                antes: document.getElementById("antes").value,
                descuento: document.getElementById("descuento").value,
                ahorro: document.getElementById("ahorro").value,
                categoria: document.getElementById("categoria").value,
                enlace: document.getElementById("enlace").value

            });

            alert("✅ Oferta actualizada");

            editando = null;

            formulario.querySelector("button").textContent = "🚀 PUBLICAR OFERTA";

        } else {

            await addDoc(collection(db, "ofertas"), {

                nombre: document.getElementById("nombre").value,
                precio: document.getElementById("precio").value,
                antes: document.getElementById("antes").value,
                descuento: document.getElementById("descuento").value,
                ahorro: document.getElementById("ahorro").value,
                categoria: document.getElementById("categoria").value,
                enlace: document.getElementById("enlace").value,
                imagen: "images/" + document.getElementById("imagen").value

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
