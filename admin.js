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
    orderBy,
    limit,
    startAfter,
    startAt
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const formulario = document.getElementById("formOferta");
const txtPegadoRapido = document.getElementById("pegadoRapido");
const btnNuevaOferta = document.getElementById("btnNuevaOferta");
const tipoDescuento = document.getElementById("tipoDescuento");
const contenedorCodigo = document.getElementById("contenedorCodigo");

function procesarPegadoRapido(texto) {

    if (!texto) return;

    texto = texto.trim();

    const lineas = texto
        .split("\n")
        .map(l => l.trim())
        .filter(l => l !== "");

    // Nombre
    document.getElementById("nombre").value = lineas[0] || "";

    // Precio
    const precio = texto.match(/💲\s?(\d+(?:\.\d+)?)/);

    if (precio) {
        document.getElementById("precio").value = precio[1];
    }

    // Precio anterior
    const antes = texto.match(/Antes\s*💲\s?(\d+(?:\.\d+)?)/i);

    if (antes) {
        document.getElementById("antes").value = antes[1];
    }

    // Enlace
const enlace = texto.match(/https?:\/\/\S+/);

if (enlace) {
    document.getElementById("enlace").value = enlace[0];
}

// Código promocional
const codigo = texto.match(/(?:código|codigo)(?:\s+promocional)?[:\s]*([A-Z0-9-]+)/i);

if (codigo) {
    document.getElementById("codigo").value = codigo[1];
}

// Detectar automáticamente el tipo de descuento

const textoMinusculas = texto.toLowerCase();

if (
    textoMinusculas.includes("código") ||
    textoMinusculas.includes("codigo")
) {

    tipoDescuento.value = "codigo";

} else if (
    textoMinusculas.includes("cupón") ||
    textoMinusculas.includes("cupon")
) {

    tipoDescuento.value = "cupon";

} else {

    tipoDescuento.value = "precio";

}

actualizarColorTipoDescuento();
    
}

function actualizarColorTipoDescuento() {

    if (tipoDescuento.value === "precio") {

        tipoDescuento.style.backgroundColor = "#16a34a";
        contenedorCodigo.style.display = "none";

    } else if (tipoDescuento.value === "cupon") {

        tipoDescuento.style.backgroundColor = "#7c3aed";
        contenedorCodigo.style.display = "none";

    } else if (tipoDescuento.value === "codigo") {

        tipoDescuento.style.backgroundColor = "#2563eb";
        contenedorCodigo.style.display = "block";

    }

    tipoDescuento.style.color = "#ffffff";

}
btnNuevaOferta.addEventListener("click", async () => {

    try {

        const texto = await navigator.clipboard.readText();

        procesarPegadoRapido(texto);
        

    } catch (error) {

        alert("No se pudo acceder al portapapeles.");

    }

});

const tbody = document.querySelector("#tablaOfertas tbody");
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const infoPagina = document.getElementById("infoPagina");

tbody.addEventListener("click", async (e) => {

    const boton = e.target.closest("button");

    if (!boton) return;

    const id = boton.dataset.id;

    // ==========================
    // EDITAR
    // ==========================

    if (boton.classList.contains("editar")) {

        const documento = await getDoc(doc(db, "ofertas", id));
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
    
        editando = id;

        formulario.querySelector("button").textContent =
            "💾 GUARDAR CAMBIOS";

        return;
    }

    // ==========================
    // MOVER A AYER
    // ==========================

    if (boton.classList.contains("moverAyer")) {

        if (!confirm("¿Mover esta oferta a AYER?")) return;

        const ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);

        const diaAyer =
    ayer.getFullYear() + "-" +
    String(ayer.getMonth() + 1).padStart(2, "0") + "-" +
    String(ayer.getDate()).padStart(2, "0");

await updateDoc(doc(db, "ofertas", id), {
    fecha: ayer.getTime(),
    dia: diaAyer
});

        cargarOfertas();

        return;
    }

    // ==========================
    // ELIMINAR
    // ==========================

    if (boton.classList.contains("eliminar")) {

        if (!confirm("¿Eliminar esta oferta?")) return;

        await deleteDoc(doc(db, "ofertas", id));

        cargarOfertas();

    }

});

let editando = null;

const OFERTAS_POR_PAGINA = 50;

let ultimaOferta = null;
let primeraOferta = null;

const historialPaginas = [];

let paginaActual = 1;
let totalPaginas = 1;

// ===============================
// Cargar ofertas
// ===============================
async function cargarOfertas() {

    tbody.innerHTML = "";

    const q = query(
    collection(db, "ofertas"),
    orderBy("fecha", "desc"),
    limit(OFERTAS_POR_PAGINA)
);

const consulta = await getDocs(q);

    const totalConsulta = await getDocs(collection(db, "ofertas"));

totalPaginas = Math.ceil(totalConsulta.size / OFERTAS_POR_PAGINA);

if (totalPaginas === 0) totalPaginas = 1;

    if (!consulta.empty) {

    primeraOferta = consulta.docs[0];
    ultimaOferta = consulta.docs[consulta.docs.length - 1];

}

    const total = document.getElementById("totalOfertas");

if (total) {
    total.textContent = `📦 ${consulta.size} ofertas publicadas`;
}

let html = "";
    
    consulta.forEach((documento) => {

        const oferta = documento.data();

    html += `
<tr>

    <td>
        <input
            type="checkbox"
            class="seleccionOferta"
            value="${documento.id}">
    </td>

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
<button class="eliminar" data-id="${documento.id}">🗑️</button>
    </td>

</tr>
`;

    });

    tbody.innerHTML = html;

    infoPagina.textContent =
    `Página ${paginaActual} de ${totalPaginas}`;
    
    // ===============================
// EVENTOS DE LA TABLA
// ===============================

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

let descuento = 0;

if (antes > 0) {
    descuento = Math.round(((antes - precio) / antes) * 100);
}

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
    tipoDescuento: document.getElementById("tipoDescuento").value,
    estado: document.getElementById("estado").value,

    fechaExpiracion: document.getElementById("fechaExpiracion").value,

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
    tipoDescuento: document.getElementById("tipoDescuento").value,
    estado: document.getElementById("estado").value,

    clics: 0,

    fecha: Date.now(),

    dia: new Date().toLocaleDateString("en-CA"),

    fechaExpiracion: document.getElementById("fechaExpiracion").value

});

    alert("✅ Oferta publicada");

}

        const tipoActual = tipoDescuento.value;

        formulario.reset();

        tipoDescuento.value = tipoActual;
        actualizarColorTipoDescuento();

        vence4Dias();

        cargarOfertas();

    } catch (error) {

        console.error(error);

        alert("❌ Error");

    }

});

async function iniciarPanel() {

    const consulta = await getDocs(collection(db, "ofertas"));

    const hoy = new Date();
    hoy.setHours(0,0,0,0);

    for (const documento of consulta.docs) {

        const oferta = documento.data();

        if (!oferta.fechaExpiracion) continue;

        const vence = new Date(oferta.fechaExpiracion);
        vence.setHours(0,0,0,0);

        if (vence.getTime() < hoy.getTime()) {

            await deleteDoc(doc(db, "ofertas", documento.id));

            console.log("🗑️ Eliminada:", oferta.nombre);

        }

    }

    cargarOfertas();

}

// ===============================
// Iniciar
// ===============================
iniciarPanel();

// ===============================
// BOTÓN SIGUIENTE
// ===============================

btnSiguiente.addEventListener("click", async () => {

    if (!ultimaOferta) return;

    const q = query(

        collection(db, "ofertas"),

        orderBy("fecha", "desc"),

        startAfter(ultimaOferta),

        limit(OFERTAS_POR_PAGINA)

    );

    const consulta = await getDocs(q);

    historialPaginas.push(primeraOferta);

    if (consulta.empty) return;

    primeraOferta = consulta.docs[0];
    ultimaOferta = consulta.docs[consulta.docs.length - 1];

    btnAnterior.disabled = false;

    paginaActual++;

    infoPagina.textContent = `Página ${paginaActual}`;

    let html = "";

    consulta.forEach((documento) => {

        const oferta = documento.data();

        html += `
<tr>

<td>
<input
type="checkbox"
class="seleccionOferta"
value="${documento.id}">
</td>

<td>
<img
src="${oferta.imagen}"
class="miniatura">
</td>

<td>${oferta.nombre}</td>

<td>$${oferta.precio}</td>

<td>${oferta.clics || 0}</td>

<td>

<button class="editar" data-id="${documento.id}">
✏️
</button>

<button class="moverAyer" data-id="${documento.id}">
📅
</button>

<button class="eliminar" data-id="${documento.id}">
🗑️
</button>

</td>

</tr>
`;

    });

    tbody.innerHTML = html;

});

// ===============================
// BOTÓN ANTERIOR
// ===============================

btnAnterior.addEventListener("click", async () => {

    if (historialPaginas.length === 0) return;

    const cursor = historialPaginas.pop();

    const q = query(
        collection(db, "ofertas"),
        orderBy("fecha", "desc"),
        startAt(cursor),
        limit(OFERTAS_POR_PAGINA)
    );

    const consulta = await getDocs(q);

    if (consulta.empty) return;

    primeraOferta = consulta.docs[0];
    ultimaOferta = consulta.docs[consulta.docs.length - 1];

    btnAnterior.disabled = historialPaginas.length === 0;

    paginaActual--;

    if (paginaActual < 1) {
    paginaActual = 1;
}

infoPagina.textContent = `Página ${paginaActual}`;

    let html = "";

    consulta.forEach((documento) => {

        const oferta = documento.data();

        html += `
<tr>

<td><input type="checkbox" class="seleccionOferta" value="${documento.id}"></td>

<td><img src="${oferta.imagen}" class="miniatura"></td>

<td>${oferta.nombre}</td>

<td>$${oferta.precio}</td>

<td>${oferta.clics || 0}</td>

<td>
<button class="editar" data-id="${documento.id}">✏️</button>
<button class="moverAyer" data-id="${documento.id}">📅</button>
<button class="eliminar" data-id="${documento.id}">🗑️</button>
</td>

</tr>`;
    });

    tbody.innerHTML = html;

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

window.vence4Dias = function(){

    const fecha = new Date();

    fecha.setDate(fecha.getDate() + 4);

    document.getElementById("fechaExpiracion").value =
        fecha.toISOString().split("T")[0];

    document.getElementById("btn4Dias").style.background = "#f59e0b";
    document.getElementById("btn4Dias").style.color = "#fff";

    document.getElementById("btnManana").style.background = "#e5e7eb";
    document.getElementById("btnManana").style.color = "#333";

}

vence4Dias();

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

const codigo = document.getElementById("codigo");
const etiquetaCodigo = codigo.previousElementSibling;

tipoDescuento.addEventListener("change", actualizarColorTipoDescuento);

actualizarColorTipoDescuento();


const btnCorregirDias = document.getElementById("btnCorregirDias");

if (btnCorregirDias) {

    btnCorregirDias.addEventListener("click", async () => {

    if (!confirm("¿Agregar el campo 'dia' a todas las ofertas?")) return;

    const consulta = await getDocs(
        query(collection(db, "ofertas"))
    );

    let contador = 0;

    for (const documento of consulta.docs) {

        const oferta = documento.data();

        if (!oferta.fecha) continue;

        const fecha = new Date(oferta.fecha);

        const dia =
            fecha.getFullYear() + "-" +
            String(fecha.getMonth() + 1).padStart(2, "0") + "-" +
            String(fecha.getDate()).padStart(2, "0");

        await updateDoc(doc(db, "ofertas", documento.id), {
            dia: dia
        });

        contador++;

    }

        alert(`✅ ${contador} ofertas actualizadas.`);

    });

}

// ===========================
// ARRASTRAR IMAGEN
// ===========================

const zonaImagen = document.getElementById("zonaImagen");
const inputImagen = document.getElementById("imagen");
const selectorImagen = document.getElementById("selectorImagen");

zonaImagen.addEventListener("click", (e) => {

    if (e.target !== inputImagen) {
        selectorImagen.click();
    }

});

if (zonaImagen && inputImagen) {

    zonaImagen.addEventListener("dragover", (e) => {
        e.preventDefault();
        zonaImagen.classList.add("dragover");
    });

    zonaImagen.addEventListener("dragleave", () => {
        zonaImagen.classList.remove("dragover");
    });

    zonaImagen.addEventListener("drop", (e) => {

        e.preventDefault();

        zonaImagen.classList.remove("dragover");

        const archivo = e.dataTransfer.files[0];
        
        console.log("Imagen detectada:", archivo);

        if (!archivo) return;

        // Solo permite imágenes
        if (!archivo.type.startsWith("image/")) {
            alert("Solo puedes arrastrar imágenes.");
            return;
        }

        // Escribe automáticamente el nombre del archivo
        inputImagen.value = archivo.name;

    });

selectorImagen.addEventListener("change", () => {

    if (!selectorImagen.files.length) return;

    const archivo = selectorImagen.files[0];

    inputImagen.value = archivo.name;

    const texto = zonaImagen.querySelector("small");

    if (texto) {
        texto.textContent = "✅ " + archivo.name;
    }

});
    
}

tipoDescuento.addEventListener("change", actualizarColorTipoDescuento);
actualizarColorTipoDescuento();

const seleccionarTodo = document.getElementById("seleccionarTodo");
const btnEliminarSeleccionadas = document.getElementById("btnEliminarSeleccionadas");

// Seleccionar o deseleccionar todas
seleccionarTodo.addEventListener("change", () => {

    document.querySelectorAll(".seleccionOferta").forEach(check => {

        check.checked = seleccionarTodo.checked;

    });

});

// Eliminar seleccionadas
btnEliminarSeleccionadas.addEventListener("click", async () => {

    const seleccionadas = document.querySelectorAll(".seleccionOferta:checked");

    if (seleccionadas.length === 0) {

        alert("Selecciona al menos una oferta.");

        return;

    }

    if (!confirm(`¿Eliminar ${seleccionadas.length} ofertas?`)) return;

    for (const item of seleccionadas) {

        await deleteDoc(doc(db, "ofertas", item.value));

    }

    alert(`✅ ${seleccionadas.length} ofertas eliminadas.`);

    seleccionarTodo.checked = false;

    cargarOfertas();

});
