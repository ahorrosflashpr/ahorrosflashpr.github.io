import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    updateDoc,
    increment
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

let ofertas = [];

const contenedor = document.getElementById("productos");
const buscador = document.getElementById("buscador");
const featured = document.getElementById("featured");

function mostrarOfertaDestacada(oferta){

featured.innerHTML = `
<div class="featured">

    <div class="featured-image">
        <img src="${oferta.imagen}" alt="${oferta.nombre}">
    </div>

    <div class="featured-info">

        <span class="featured-badge">${oferta.etiqueta}</span>

        <h2>${oferta.nombre}</h2>

        <p class="featured-price">
            <del>${oferta.antes}</del>
            <strong>${oferta.precio}</strong>
        </p>

        <p>💰 Ahorras ${oferta.ahorro}</p>

        <a href="${oferta.enlace}" target="_blank">
            Comprar Ahora
        </a>

    </div>

</div>
`;

}

function mostrarOfertas(lista) {

    contenedor.innerHTML = "";

    lista.forEach(oferta => {

        const ahorro = (
            parseFloat(oferta.antes) - parseFloat(oferta.precio)
        ).toFixed(2);

        contenedor.innerHTML += `
        <div class="card">

            <div class="descuento">-${oferta.descuento}</div>

            <img src="${oferta.imagen}" alt="${oferta.nombre}">

            <h2>${oferta.nombre}</h2>

            <p class="old">$${oferta.antes}</p>

            <p class="price">$${oferta.precio}</p>

            <p class="ahorro">
                💰 Ahorras $${ahorro}
            </p>

            ${oferta.codigo ? `
                <button class="btn-codigo" onclick="copiarCodigo('${oferta.codigo}', this)">
                    📋 COPIAR CÓDIGO: ${oferta.codigo}
                </button>
            ` : ""}

            <button
    class="btn-oferta"
    onclick="abrirOferta('${oferta.id}','${oferta.enlace}')">

    🔥 VER OFERTA AHORA

</button>

        </div>
        `;

    });

}

buscador.addEventListener("input", () => {

    const texto = buscador.value.toLowerCase();

    const filtradas = ofertas.filter(oferta =>
    oferta.nombre.toLowerCase().includes(texto)
);

    mostrarOfertas(filtradas);

});

function filtrarCategoria(categoria){

    if(categoria === "Todas"){
        mostrarOfertas(ofertas);
        return;
    }

    const filtradas = ofertas.filter(oferta =>
        oferta.categoria === categoria
    );

    mostrarOfertas(filtradas);

}

const ahora = new Date();

const opciones = {
    hour: "numeric",
    minute: "2-digit"
};

document.getElementById("fechaActualizacion").textContent =
    "Hoy " + ahora.toLocaleTimeString("es-PR", opciones);

async function cargarOfertasFirebase() {

    ofertas = [];

    const q = query(
        collection(db, "ofertas"),
        orderBy("fecha", "desc")
    );

    const consulta = await getDocs(q);

    consulta.forEach((documento) => {

    const oferta = documento.data();

    oferta.id = documento.id;

    // Si la imagen solo tiene el nombre, agrega la carpeta images/
    if (oferta.imagen && !oferta.imagen.startsWith("images/")) {
        oferta.imagen = "images/" + oferta.imagen;
    }

    // Solo mostrar ofertas activas
    if ((oferta.estado || "activa") === "activa") {
        ofertas.push(oferta);
    }

});
    mostrarOfertas(ofertas);

    if (ofertas.length) {

    const minutos = Math.floor(
        (Date.now() - ofertas[0].fecha) / 60000
    );

    let texto = "";

    if (minutos < 1) {

        texto = "🚨 ¡Nueva oferta recién publicada!";

    } else if (minutos < 60) {

        texto = `🆕 Nueva oferta publicada hace ${minutos} minuto${minutos > 1 ? "s" : ""}`;

    } else if (minutos < 1440) {

        const horas = Math.floor(minutos / 60);

        texto = `🕒 Última oferta publicada hace ${horas} hora${horas > 1 ? "s" : ""}`;

    } else {

        const dias = Math.floor(minutos / 1440);

        texto = `📅 Última oferta publicada hace ${dias} día${dias > 1 ? "s" : ""}`;

    }

    document.getElementById("nuevaOferta").innerHTML = texto;

}

}

cargarOfertasFirebase();

window.copiarCodigo = async function(codigo, boton){

    try{

        await navigator.clipboard.writeText(codigo);

        const texto = boton.innerHTML;

        boton.innerHTML = "✅ ¡Código copiado!";

        setTimeout(()=>{

            boton.innerHTML = texto;

        },2000);

    }catch{

        alert("No se pudo copiar el código.");

    }

}

// ===============================
// CONTADOR DE CLICS
// ===============================

window.abrirOferta = async function(id, enlace){

    try{

        await updateDoc(
            doc(db, "ofertas", id),
            {
                clics: increment(1)
            }
        );

    }catch(error){

        console.error(error);

    }

    window.open(enlace, "_blank");

}

// ===============================
// BOTÓN SUBIR
// ===============================

const btnSubir = document.getElementById("btnSubir");

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        btnSubir.style.display = "flex";

    } else {

        btnSubir.style.display = "none";

    }

});

btnSubir.addEventListener("click", () => {

    window.scrollTo({

        top: 0,
        behavior: "smooth"

    });

});
