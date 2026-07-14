const contenedor = document.getElementById("productos");

ofertas.forEach(oferta => {

contenedor.innerHTML += `
<div class="card">

<div class="badge">🔥 OFERTA FLASH</div>

<img src="${oferta.imagen}" alt="${oferta.nombre}">

<h2>${oferta.nombre}</h2>

<p class="old">${oferta.antes}</p>

<p class="price">${oferta.precio}</p>

<span class="off">${oferta.descuento}</span>

<a href="${oferta.enlace}" target="_blank">Ver Oferta</a>

</div>
`;

});
