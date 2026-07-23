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
const btnProcesar = document.getElementById("btnProcesar");
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
        document.getElementById("categoria").value =
            oferta.categoria || "Automática";

        btnCategoria.innerHTML =
            `${oferta.categoria || "🤖 Automática"}<span>▼</span>`;

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

        await updateDoc(doc(db, "ofertas", id), {
            fecha: ayer.getTime()
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

    dia: new Date().toLocaleDateString("en-CA"),

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

btnCategorias.addEventListener("click", async () => {

    modalCategorias.style.display = "flex";

    const contenedor = document.getElementById("listaCategorias");

    contenedor.innerHTML = "Cargando ofertas...";

    const consulta = await getDocs(
        query(collection(db, "ofertas"), orderBy("nombre"))
    );

    contenedor.innerHTML = "";

    consulta.forEach((documento) => {

        const oferta = documento.data();

        contenedor.innerHTML += `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;gap:10px;">

            <span style="flex:1">${oferta.nombre}</span>

            <select class="categoriaMasiva" data-id="${documento.id}">
                <option value="Tecnología" ${oferta.categoria==="Tecnología"?"selected":""}>Tecnología</option>
                <option value="Hogar" ${oferta.categoria==="Hogar"?"selected":""}>Hogar</option>
                <option value="Cocina" ${oferta.categoria==="Cocina"?"selected":""}>Cocina</option>
                <option value="Belleza" ${oferta.categoria==="Belleza"?"selected":""}>Belleza</option>
                <option value="Moda" ${oferta.categoria==="Moda"?"selected":""}>Moda</option>
                <option value="Mascotas" ${oferta.categoria==="Mascotas"?"selected":""}>Mascotas</option>
                <option value="Bebés" ${oferta.categoria==="Bebés"?"selected":""}>Bebés</option>
                <option value="Juguetes" ${oferta.categoria==="Juguetes"?"selected":""}>Juguetes</option>
                <option value="Viajes" ${oferta.categoria==="Viajes"?"selected":""}>Viajes</option>
                <option value="Oficina" ${oferta.categoria==="Oficina"?"selected":""}>Oficina</option>
                <option value="Otros" ${oferta.categoria==="Otros"?"selected":""}>Otros</option>
            </select>

        </div>`;
    });

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

    const texto = buscador.value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

    document.querySelectorAll("#tablaOfertas tbody tr").forEach(fila => {

        const producto = fila.children[1].textContent.toLowerCase();

        fila.style.display =
            producto.includes(texto) ? "" : "none";

    });

});

const guardarCategorias = document.getElementById("guardarCategorias");

guardarCategorias.addEventListener("click", async () => {

    const categorias = document.querySelectorAll(".categoriaMasiva");

    for (const item of categorias) {

        await updateDoc(doc(db, "ofertas", item.dataset.id), {
            categoria: item.value
        });

    }

    alert("✅ Todas las categorías se guardaron correctamente.");

    modalCategorias.style.display = "none";

    cargarOfertas();

});

const btnMoverSeleccionadas = document.getElementById("btnMoverSeleccionadas");

btnMoverSeleccionadas.addEventListener("click", async () => {

    const seleccionadas = document.querySelectorAll(".seleccionOferta:checked");

    if (seleccionadas.length === 0) {
        alert("Selecciona al menos una oferta.");
        return;
    }

    if (!confirm(`¿Mover ${seleccionadas.length} ofertas a AYER?`)) return;

    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);

    const nuevaFecha = ayer.getTime();

    for (const item of seleccionadas) {

        await updateDoc(doc(db, "ofertas", item.value), {
            fecha: nuevaFecha
        });

    }

    alert("✅ Ofertas movidas correctamente.");

    cargarOfertas();

});

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

btnProcesar.addEventListener("click", () => {

    const texto = txtPegadoRapido.value.trim();

    if (!texto) return;

    const lineas = texto
        .split("\n")
        .map(l => l.trim())
        .filter(l => l !== "");

    // Nombre
    document.getElementById("nombre").value = lineas[0] || "";

});
