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
function detectarCategoria(nombre){

    nombre = nombre.toLowerCase();

    if (
    nombre.includes("juguete") ||
    nombre.includes("lego") ||
    nombre.includes("barbie") ||
    nombre.includes("hot wheels") ||
    nombre.includes("disney") ||
    nombre.includes("pixar") ||
    nombre.includes("marvel") ||
    nombre.includes("spiderman") ||
    nombre.includes("batman") ||
    nombre.includes("superman") ||
    nombre.includes("princesa") ||
    nombre.includes("princess") ||
    nombre.includes("frozen") ||
    nombre.includes("mickey") ||
    nombre.includes("minnie") ||
    nombre.includes("stitch") ||
    nombre.includes("hello kitty") ||
    nombre.includes("pokemon") ||
    nombre.includes("pikachu") ||
    nombre.includes("minecraft") ||
    nombre.includes("roblox") ||
    nombre.includes("sonic") ||
    nombre.includes("mario") ||
    nombre.includes("luigi") ||
    nombre.includes("nerf") ||
    nombre.includes("play-doh") ||
    nombre.includes("play doh") ||
    nombre.includes("funko") ||
    nombre.includes("lol surprise") ||
    nombre.includes("muñeca") ||
    nombre.includes("muneca") ||
    nombre.includes("muñeco") ||
    nombre.includes("peluche") ||
    nombre.includes("rompecabezas") ||
    nombre.includes("puzzle") ||
    nombre.includes("carrito") ||
    nombre.includes("camión de juguete") ||
    nombre.includes("camion de juguete") ||
    nombre.includes("tren de juguete") ||
    nombre.includes("casa de muñecas") ||
    nombre.includes("casa de munecas") ||
    nombre.includes("figura de acción") ||
    nombre.includes("figura de accion") ||
    nombre.includes("hasbro") ||
    nombre.includes("mattel") ||
    nombre.includes("fisher-price")
){
    return "Juguetes";
}

    if (
    nombre.includes("bebé") ||
    nombre.includes("bebe") ||
    nombre.includes("baby") ||
    nombre.includes("recién nacido") ||
    nombre.includes("recien nacido") ||
    nombre.includes("pañal") ||
    nombre.includes("panal") ||
    nombre.includes("toallitas") ||
    nombre.includes("wipe") ||
    nombre.includes("biberón") ||
    nombre.includes("biberon") ||
    nombre.includes("chupón") ||
    nombre.includes("chupon") ||
    nombre.includes("chupete") ||
    nombre.includes("mamadera") ||
    nombre.includes("coche") ||
    nombre.includes("carriola") ||
    nombre.includes("stroller") ||
    nombre.includes("moisés") ||
    nombre.includes("moises") ||
    nombre.includes("cuna") ||
    nombre.includes("corral") ||
    nombre.includes("silla para auto") ||
    nombre.includes("car seat") ||
    nombre.includes("porta bebé") ||
    nombre.includes("porta bebe") ||
    nombre.includes("mochila portabebé") ||
    nombre.includes("portabebé") ||
    nombre.includes("portabebe") ||
    nombre.includes("babero") ||
    nombre.includes("mordedor") ||
    nombre.includes("extractor de leche") ||
    nombre.includes("sacaleches") ||
    nombre.includes("monitor para bebé") ||
    nombre.includes("monitor para bebe") ||
    nombre.includes("fórmula") ||
    nombre.includes("formula") ||
    nombre.includes("enfamil") ||
    nombre.includes("similac") ||
    nombre.includes("dr. brown") ||
    nombre.includes("philips avent") ||
    nombre.includes("graco") ||
    nombre.includes("fisher-price") ||
    nombre.includes("skip hop") ||
    nombre.includes("huggies") ||
    nombre.includes("pampers")
){
    return "Bebés";
}

    if (
    nombre.includes("maquillaje") ||
    nombre.includes("base") ||
    nombre.includes("corrector") ||
    nombre.includes("rubor") ||
    nombre.includes("blush") ||
    nombre.includes("labial") ||
    nombre.includes("lipstick") ||
    nombre.includes("brillo labial") ||
    nombre.includes("rimel") ||
    nombre.includes("máscara") ||
    nombre.includes("mascara") ||
    nombre.includes("delineador") ||
    nombre.includes("sombras") ||
    nombre.includes("paleta") ||
    nombre.includes("brochas") ||
    nombre.includes("esponja de maquillaje") ||
    nombre.includes("perfume") ||
    nombre.includes("fragancia") ||
    nombre.includes("colonia") ||
    nombre.includes("shampoo") ||
    nombre.includes("acondicionador") ||
    nombre.includes("cepillo de cabello") ||
    nombre.includes("secador") ||
    nombre.includes("plancha para cabello") ||
    nombre.includes("rizador") ||
    nombre.includes("cepillo alisador") ||
    nombre.includes("crema facial") ||
    nombre.includes("protector solar") ||
    nombre.includes("serum") ||
    nombre.includes("suero facial") ||
    nombre.includes("limpiador facial") ||
    nombre.includes("hidratante") ||
    nombre.includes("mascarilla facial") ||
    nombre.includes("uñas") ||
    nombre.includes("esmalte") ||
    nombre.includes("manicure") ||
    nombre.includes("pedicure") ||
    nombre.includes("depiladora") ||
    nombre.includes("afeitadora") ||
    nombre.includes("revlon") ||
    nombre.includes("maybelline") ||
    nombre.includes("l'oréal") ||
    nombre.includes("loreal") ||
    nombre.includes("cerave") ||
    nombre.includes("neutrogena") ||
    nombre.includes("cetaphil") ||
    nombre.includes("olay") ||
    nombre.includes("dyson airwrap")
){
    return "Belleza";
    }

    if (
    nombre.includes("laptop") ||
    nombre.includes("computadora") ||
    nombre.includes("pc") ||
    nombre.includes("monitor") ||
    nombre.includes("mouse") ||
    nombre.includes("teclado") ||
    nombre.includes("impresora") ||
    nombre.includes("bluetooth") ||
    nombre.includes("usb") ||
    nombre.includes("ssd") ||
    nombre.includes("router") ||
    nombre.includes("webcam") ||
    nombre.includes("tablet") ||
    nombre.includes("ipad") ||
    nombre.includes("iphone") ||
    nombre.includes("android") ||
    nombre.includes("samsung") ||
    nombre.includes("apple") ||
    nombre.includes("echo") ||
    nombre.includes("alexa") ||
    nombre.includes("fire tv") ||
    nombre.includes("kindle") ||
    nombre.includes("logitech") ||
    nombre.includes("hp") ||
    nombre.includes("epson") ||
    nombre.includes("canon") ||
    nombre.includes("jbl") ||
    nombre.includes("anker")
){
    return "Tecnología";
}

    if (
    nombre.includes("máquina de café") ||
    nombre.includes("maquina de cafe") ||
    nombre.includes("cafetera") ||
    nombre.includes("café") ||
    nombre.includes("cafe") ||
    nombre.includes("coffee") ||
    nombre.includes("espresso") ||
    nombre.includes("keurig") ||
    nombre.includes("nespresso") ||
    nombre.includes("kitchenaid") ||
    nombre.includes("ninja") ||
    nombre.includes("oster") ||
    nombre.includes("hamilton") ||
    nombre.includes("cuisinart") ||
    nombre.includes("freidora") ||
    nombre.includes("air fryer") ||
    nombre.includes("olla") ||
    nombre.includes("sartén") ||
    nombre.includes("sarten") ||
    nombre.includes("licuadora") ||
    nombre.includes("batidora") ||
    nombre.includes("tostadora") ||
    nombre.includes("microondas") ||
    nombre.includes("horno")
){
    return "Cocina";
    }
    
    if (
    nombre.includes("organizador") ||
    nombre.includes("estante") ||
    nombre.includes("repisa") ||
    nombre.includes("mueble") ||
    nombre.includes("mesa") ||
    nombre.includes("escritorio") ||
    nombre.includes("silla") ||
    nombre.includes("sofá") ||
    nombre.includes("sofa") ||
    nombre.includes("almohada") ||
    nombre.includes("colchón") ||
    nombre.includes("colchon") ||
    nombre.includes("sábana") ||
    nombre.includes("sabana") ||
    nombre.includes("cortina") ||
    nombre.includes("lámpara") ||
    nombre.includes("lampara") ||
    nombre.includes("espejo") ||
    nombre.includes("alfombra") ||
    nombre.includes("canasta") ||
    nombre.includes("cesto") ||
    nombre.includes("perchero") ||
    nombre.includes("gabinete") ||
    nombre.includes("clóset") ||
    nombre.includes("closet") ||
    nombre.includes("baño") ||
    nombre.includes("bano") ||
    nombre.includes("ducha") ||
    nombre.includes("toalla") ||
    nombre.includes("lavandería") ||
    nombre.includes("lavanderia") ||
    nombre.includes("limpieza") ||
    nombre.includes("aspiradora") ||
    nombre.includes("dyson") ||
    nombre.includes("shark") ||
    nombre.includes("robot") ||
    nombre.includes("roomba") ||
    nombre.includes("aire acondicionado") ||
    nombre.includes("ventilador")
){
    return "Hogar";
}

    if (
    nombre.includes("mascota") ||
    nombre.includes("perro") ||
    nombre.includes("perros") ||
    nombre.includes("gato") ||
    nombre.includes("gatos") ||
    nombre.includes("cachorro") ||
    nombre.includes("puppy") ||
    nombre.includes("kitten") ||
    nombre.includes("collar") ||
    nombre.includes("correa") ||
    nombre.includes("arnés") ||
    nombre.includes("arnes") ||
    nombre.includes("cama para perro") ||
    nombre.includes("cama para gato") ||
    nombre.includes("comedero") ||
    nombre.includes("bebedero") ||
    nombre.includes("fuente de agua") ||
    nombre.includes("rascador") ||
    nombre.includes("transportadora") ||
    nombre.includes("jaula") ||
    nombre.includes("arena para gato") ||
    nombre.includes("juguete para perro") ||
    nombre.includes("juguete para gato") ||
    nombre.includes("alimento para perro") ||
    nombre.includes("alimento para gato") ||
    nombre.includes("purina") ||
    nombre.includes("pedigree") ||
    nombre.includes("friskies") ||
    nombre.includes("meow mix") ||
    nombre.includes("blue buffalo") ||
    nombre.includes("hills") ||
    nombre.includes("royal canin")
){
    return "Mascotas";
}

    if (
    nombre.includes("camisa") ||
    nombre.includes("camiseta") ||
    nombre.includes("blusa") ||
    nombre.includes("pantalón") ||
    nombre.includes("pantalon") ||
    nombre.includes("jeans") ||
    nombre.includes("mahón") ||
    nombre.includes("mahon") ||
    nombre.includes("short") ||
    nombre.includes("falda") ||
    nombre.includes("vestido") ||
    nombre.includes("abrigo") ||
    nombre.includes("chaqueta") ||
    nombre.includes("sudadera") ||
    nombre.includes("hoodie") ||
    nombre.includes("suéter") ||
    nombre.includes("sueter") ||
    nombre.includes("zapato") ||
    nombre.includes("zapatos") ||
    nombre.includes("tenis") ||
    nombre.includes("sandalia") ||
    nombre.includes("pantufla") ||
    nombre.includes("bota") ||
    nombre.includes("cartera") ||
    nombre.includes("bolso") ||
    nombre.includes("mochila") ||
    nombre.includes("billetera") ||
    nombre.includes("gorra") ||
    nombre.includes("sombrero") ||
    nombre.includes("reloj") ||
    nombre.includes("gafas") ||
    nombre.includes("lentes") ||
    nombre.includes("aretes") ||
    nombre.includes("pulsera") ||
    nombre.includes("collar") ||
    nombre.includes("anillo") ||
    nombre.includes("nike") ||
    nombre.includes("adidas") ||
    nombre.includes("crocs") ||
    nombre.includes("puma") ||
    nombre.includes("under armour") ||
    nombre.includes("new balance") ||
    nombre.includes("skechers") ||
    nombre.includes("levi") ||
    nombre.includes("tommy") ||
    nombre.includes("calvin klein")
){
    return "Moda";
}

    return "Otros";

}

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
    estado: document.getElementById("estado").value,

    fecha: Date.now()

});

    alert("✅ Oferta actualizada");

    editando = null;

    formulario.querySelector("button").textContent = "🚀 PUBLICAR OFERTA";

} else {

    console.log("Guardando fecha:", Date.now());

    const categoria = detectarCategoria(document.getElementById("nombre").value);
    
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
    estado: document.getElementById("estado").value,

    clics: 0,

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
