import { db } from "./firebase.js";

import {
    collection,
    getDocs
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

        contenedor.innerHTML += `
        <div class="card">

            <div class="badge">${oferta.etiqueta || "🔥 Oferta Flash"}</div>

            <div class="descuento">-${oferta.descuento}</div>

            <img src="${oferta.imagen}" alt="${oferta.nombre}">

            <h2>${oferta.nombre}</h2>

            <p class="old">${oferta.antes}</p>

            <p class="price">${oferta.precio}</p>

            <a href="${oferta.enlace}" target="_blank" class="btn-oferta">
🔥 VER OFERTA AHORA
</a>

        </div>
        `;
    });

}

buscador.addEventListener("input", () => {

    const texto = buscador.value.toLowerCase();

    const filtradas = ofertas.filter(oferta =>
        oferta.nombre.toLowerCase().includes(texto) ||
        oferta.categoria.toLowerCase().includes(texto)
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

    const consulta = await getDocs(collection(db, "ofertas"));

    ofertas = [];

    consulta.forEach((documento) => {

        const oferta = documento.data();

        // Si la imagen solo tiene el nombre, le agrega la carpeta images/
        if (oferta.imagen && !oferta.imagen.startsWith("images/")) {
            oferta.imagen = "images/" + oferta.imagen;
        }

        ofertas.push(oferta);

    });

    mostrarOfertas(ofertas);

}

cargarOfertasFirebase();
