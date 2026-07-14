const contenedor = document.getElementById("productos");
const buscador = document.getElementById("buscador");

function mostrarOfertas(lista) {

    contenedor.innerHTML = "";

    lista.forEach(oferta => {

        contenedor.innerHTML += `
        <div class="card">

            <div class="badge">${oferta.etiqueta}</div>

            <img src="${oferta.imagen}" alt="${oferta.nombre}">

            <h2>${oferta.nombre}</h2>

            <p class="old">${oferta.antes}</p>

            <p class="price">${oferta.precio}</p>

            <p class="saving">💰 Ahorras ${oferta.ahorro}</p>

            <span class="off">${oferta.descuento}</span>

            <a href="${oferta.enlace}" target="_blank">Ver Oferta</a>

        </div>
        `;
    });

}

mostrarOfertas(ofertas);

buscador.addEventListener("input", () => {

    const texto = buscador.value.toLowerCase();

    const filtradas = ofertas.filter(oferta =>
        oferta.nombre.toLowerCase().includes(texto) ||
        oferta.categoria.toLowerCase().includes(texto)
    );

    mostrarOfertas(filtradas);

});
