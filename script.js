import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy,
    where,
    doc,
    updateDoc,
    increment
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

let ofertasFiltradas = [];
let ofertasMostradas = 20;

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

    // Resaltar la categoría seleccionada
    document.querySelectorAll("#listaCategorias button").forEach(btn=>{
        btn.classList.remove("categoria-activa");

        if(btn.textContent.includes(categoria)){
            btn.classList.add("categoria-activa");
        }
    });

    if(categoria === "Todas"){
        mostrarOfertas(ofertas);
        return;
    }

    const filtradas = ofertas.filter(oferta =>
        oferta.categoria === categoria
    );

    mostrarOfertas(filtradas);

}

window.filtrarCategoria = filtrarCategoria;

const ahora = new Date();

const opciones = {
    hour: "numeric",
    minute: "2-digit"
};

document.getElementById("fechaActualizacion").textContent =
    "Hoy " + ahora.toLocaleTimeString("es-PR", opciones);

async function cargarOfertasFirebase(filtro = "hoy") {

    ofertas = [];

    let q;

    if (filtro === "todas") {

        q = query(
            collection(db, "ofertas"),
            orderBy("fecha", "desc")
        );

    } else {

        let inicio = new Date();
        let fin = null;

        switch (filtro) {

            case "hoy":
                inicio.setHours(0, 0, 0, 0);
                break;

            case "ayer":
                fin = new Date();
                fin.setHours(0, 0, 0, 0);

                inicio = new Date(fin);
                inicio.setDate(inicio.getDate() - 1);
                break;

            case "semana":
                inicio.setDate(inicio.getDate() - 7);
                break;

            case "mes":
                inicio.setMonth(inicio.getMonth() - 1);
                break;

            default:
                inicio.setHours(0, 0, 0, 0);
        }

        if (fin) {

            q = query(
                collection(db, "ofertas"),
                where("fecha", ">=", inicio.getTime()),
                where("fecha", "<", fin.getTime()),
                orderBy("fecha", "desc")
            );

        } else {

            q = query(
                collection(db, "ofertas"),
                where("fecha", ">=", inicio.getTime()),
                orderBy("fecha", "desc")
            );

        }

    }

    const consulta = await getDocs(q);

    consulta.forEach((documento) => {

        const oferta = documento.data();

        oferta.id = documento.id;

        if (oferta.imagen && !oferta.imagen.startsWith("images/")) {
            oferta.imagen = "images/" + oferta.imagen;
        }

        if ((oferta.estado || "activa") === "activa") {
            ofertas.push(oferta);
        }

    });

    ofertasFiltradas = [...ofertas];
    ofertasMostradas = 20;
    mostrarOfertas(ofertasFiltradas.slice(0, ofertasMostradas));
    actualizarBotonVerMas();
}

window.cargarOfertasFirebase = cargarOfertasFirebase;

cargarOfertasFirebase("hoy");

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

    window.location.href = enlace;

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

window.mostrarMasCategorias = function () {

    const div = document.getElementById("masCategorias");

    if (div.style.display === "none") {
        div.style.display = "flex";
    } else {
        div.style.display = "none";
    }

};

function mostrarMasCategorias() {

    const div = document.getElementById("masCategorias");

    if (div.style.display === "none" || div.style.display === "") {
        div.style.display = "flex";
    } else {
        div.style.display = "none";
    }

}

window.mostrarMasCategorias = mostrarMasCategorias;

const btnCategorias = document.getElementById("btnCategorias");
const listaCategorias = document.getElementById("listaCategorias");
const flechaCategoria = document.getElementById("flechaCategoria");

btnCategorias.addEventListener("click", () => {

    if (listaCategorias.style.display === "block") {

        listaCategorias.style.display = "none";
        flechaCategoria.textContent = "▼";

    } else {

        listaCategorias.style.display = "block";
        flechaCategoria.textContent = "▲";

    }

});

// Cerrar el menú al elegir una categoría
document.querySelectorAll("#listaCategorias button").forEach(boton => {

    boton.addEventListener("click", () => {

        listaCategorias.style.display = "none";
        flechaCategoria.textContent = "▼";

        const texto = boton.textContent.trim();

        if (texto.includes("Todas")) {
            btnCategorias.innerHTML = `
                🛍️ Buscar por categoría
                <span id="flechaCategoria">▼</span>
            `;
        } else {
            btnCategorias.innerHTML = `
                ${texto}
                <span id="flechaCategoria">▼</span>
            `;
        }

    });

});

function actualizarBotonVerMas(){

    const btn = document.getElementById("btnVerMas");

    if(!btn) return;

    if(ofertasMostradas >= ofertasFiltradas.length){
        btn.style.display = "none";
    }else{
        btn.style.display = "block";
    }

}

window.verMasOfertas = function(){

    ofertasMostradas += 20;

    mostrarOfertas(
        ofertasFiltradas.slice(0, ofertasMostradas)
    );

    actualizarBotonVerMas();

}
