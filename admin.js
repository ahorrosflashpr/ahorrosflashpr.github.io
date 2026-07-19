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

    const q = query(
    collection(db, "ofertas"),
    orderBy("fecha", "desc")
);

const consulta = await getDocs(q);

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

    <td>${oferta.clics || 0}</td>

    <td>
        <button class="editar" data-id="${documento.id}">✏️</button>
<button class="moverAyer" data-id="${documento.id}">📅</button>
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
            document.getElementById("tipoDescuento").value =
    oferta.tipoDescuento || "precio";
            document.getElementById("estado").value =
    oferta.estado || "activa";
            document.getElementById("fechaExpiracion").value =
    oferta.fechaExpiracion || "";
            document.getElementById("categoria").value =
    oferta.categoria || "Automática";

btnCategoria.innerHTML =
    `${oferta.categoria || "🤖 Automática"}<span>▼</span>`;

            editando = boton.dataset.id;

            formulario.querySelector("button").textContent =
                "💾 GUARDAR CAMBIOS";

        });

    });

// ===============================
// BOTÓN MOVER A AYER
// ===============================

document.querySelectorAll(".moverAyer").forEach((boton) => {

    boton.addEventListener("click", async () => {

        if (!confirm("¿Mover esta oferta a AYER?")) return;

        const ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);

        // Mantener la hora actual
        const nuevaFecha = ayer.getTime();

        await updateDoc(doc(db, "ofertas", boton.dataset.id), {
            fecha: nuevaFecha
        });

        cargarOfertas();

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

    const categoria = document.getElementById("categoria").value;

    await updateDoc(doc(db, "ofertas", editando), {

    nombre: document.getElementById("nombre").value,
    categoria: categoria,
    precio: precio.toFixed(2),
    antes: antes.toFixed(2),
    descuento: descuento + "%",
    ahorro: "$" + ahorro,
    enlace: document.getElementById("enlace").value,
    imagen: "images/" + document.getElementById("imagen").value,
    codigo: document.getElementById("codigo").value,
    tipoDescuento: document.getElementById("tipoDescuento").value,
    estado: document.getElementById("estado").value,

    fechaExpiracion: document.getElementById("fechaExpiracion").value,

});

    alert("✅ Oferta actualizada");

    editando = null;

    formulario.querySelector("button").textContent = "🚀 PUBLICAR OFERTA";

} else {

    console.log("Guardando fecha:", Date.now());

    const categoriaSeleccionada = document.getElementById("categoria").value;

const categoria = document.getElementById("categoria").value;
    
    await addDoc(collection(db, "ofertas"), {

    nombre: document.getElementById("nombre").value,
        categoria: categoria,
    precio: precio.toFixed(2),
    antes: antes.toFixed(2),
    descuento: descuento + "%",
    ahorro: "$" + ahorro,
    enlace: document.getElementById("enlace").value,
    imagen: "images/" + document.getElementById("imagen").value,
    codigo: document.getElementById("codigo").value,
    tipoDescuento: document.getElementById("tipoDescuento").value,
    estado: document.getElementById("estado").value,

    clics: 0,

    fecha: Date.now(),

    fechaExpiracion: document.getElementById("fechaExpiracion").value

});

    alert("✅ Oferta publicada");

}

        formulario.reset();

        vence7Dias();

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

const btnCategoria = document.getElementById("btnCategoria");
const menuCategorias = document.getElementById("menuCategorias");

btnCategoria.addEventListener("click", () => {
    menuCategorias.style.display =
        menuCategorias.style.display === "block" ? "none" : "block";
});

window.seleccionarCategoria = function(valor, texto) {
    document.getElementById("categoria").value = valor;
    btnCategoria.innerHTML = `${texto}<span>▼</span>`;
    menuCategorias.style.display = "none";
};

document.addEventListener("click", (e) => {
    if (!e.target.closest(".selectorCategoria")) {
        menuCategorias.style.display = "none";
    }
});

window.venceManana = function(){

    const fecha = new Date();

    fecha.setDate(fecha.getDate() + 1);

    document.getElementById("fechaExpiracion").value =
        fecha.toISOString().split("T")[0];

    document.getElementById("btnManana").style.background = "#f59e0b";
    document.getElementById("btnManana").style.color = "#fff";

    document.getElementById("btn7Dias").style.background = "#e5e7eb";
    document.getElementById("btn7Dias").style.color = "#333";

}

window.vence7Dias = function(){

    const fecha = new Date();

    fecha.setDate(fecha.getDate() + 7);

    document.getElementById("fechaExpiracion").value =
        fecha.toISOString().split("T")[0];

    document.getElementById("btn7Dias").style.background = "#f59e0b";
    document.getElementById("btn7Dias").style.color = "#fff";

    document.getElementById("btnManana").style.background = "#e5e7eb";
    document.getElementById("btnManana").style.color = "#333";

}

vence7Dias();

const imagen = document.getElementById("imagen");

imagen.addEventListener("blur", () => {

    let nombre = imagen.value.trim();

    if (
        nombre &&
        !/\.(jpg|jpeg|png|webp)$/i.test(nombre)
    ) {
        imagen.value = nombre + ".jpg";
    }

});

const tipo = document.getElementById("tipoDescuento");
const codigo = document.getElementById("codigo");
const etiquetaCodigo = codigo.previousElementSibling;

function actualizarTipoDescuento() {

    if (tipo.value === "codigo") {

        codigo.style.display = "block";
        etiquetaCodigo.style.display = "block";

        tipo.style.background = "#DBEAFE";
        tipo.style.border = "2px solid #3B82F6";
        tipo.style.color = "#1D4ED8";

    } else if (tipo.value === "cupon") {

        codigo.style.display = "none";
        etiquetaCodigo.style.display = "none";
        codigo.value = "";

        tipo.style.background = "#FFEDD5";
        tipo.style.border = "2px solid #F97316";
        tipo.style.color = "#9A3412";

    } else {

        codigo.style.display = "none";
        etiquetaCodigo.style.display = "none";
        codigo.value = "";

        tipo.style.background = "#DCFCE7";
        tipo.style.border = "2px solid #22C55E";
        tipo.style.color = "#166534";

    }

}

tipo.addEventListener("change", actualizarTipoDescuento);
actualizarTipoDescuento();

const btnCategorias = document.getElementById("btnCategorias");
const modalCategorias = document.getElementById("modalCategorias");
const cerrarCategorias = document.getElementById("cerrarCategorias");

btnCategorias.addEventListener("click", () => {
    modalCategorias.style.display = "flex";
});

cerrarCategorias.addEventListener("click", () => {
    modalCategorias.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modalCategorias) {
        modalCategorias.style.display = "none";
    }
});

const buscador = document.getElementById("buscarOferta");

buscador.addEventListener("keyup", () => {

    const texto = buscador.value.toLowerCase();

    document.querySelectorAll("#tablaOfertas tbody tr").forEach(fila => {

        const producto = fila.children[1].textContent.toLowerCase();

        fila.style.display =
            producto.includes(texto) ? "" : "none";

    });

});
