document.addEventListener('DOMContentLoaded', function() {
    const carritoOffCanvas = document.getElementById('carritoOffCanvas');
    const carritoOverlay = document.getElementById('carritoOverlay');
    const cerrarCarrito = document.getElementById('cerrarCarrito');
    const botonesAgregar = document.querySelectorAll('.product-btn');

    // Recuperar el carrito de localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Lista de socios
    let listaSocios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [
        {nombre: "matias", apellido: "ponce", contraseña:"argentina"},
        {nombre: "nicolas", apellido: "ponce", contraseña:"peru"},
        {nombre: "santiago", apellido: "zapata", contraseña:"colombia"},
        {nombre: "seomara", apellido: "funes", contraseña:"venezuela"},
        {nombre: "madeleine", apellido: "velazques", contraseña:"brasil"}
    ];

    function actualizarCarrito() {
        const tbody = document.getElementById('tbody');
        tbody.innerHTML = '';
        carrito.forEach((producto, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><img width="50px" src="${producto.img}" alt="${producto.nombre}"></td>
                <td class="productName"><p>${producto.nombre}</p></td>
                <td>
                    <button class="btnQuitarUnidad" data-index="${index}">-</button>
                    <p class="third-row">${producto.cantidad}</p>
                    <button class="btnAgregarUnidad" data-index="${index}">+</button>
                </td>
                <td class="priceCart">${producto.precio}</td>
                <td><button data-index="${index}" class="btnBorrar">X</button></td>
            `;
            tbody.appendChild(fila);
        });

        mostrarTotal();

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function agregarAlCarrito(producto) {
        const index = carrito.findIndex(item => item.nombre === producto.nombre);
        if (index > -1) {
            carrito[index].cantidad += 1;
        } else {
            carrito.push(producto);
        }
        actualizarCarrito();

        // Mostrar el carrito y el overlay
        carritoOffCanvas.classList.add('show');
        carritoOverlay.style.display = 'block';
    }

    function mostrarTotal() {
        let total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
        let descuento = 0;
        
        let nombreUsuario = localStorage.getItem('nombreUsuario');
        let contraseña = localStorage.getItem('contraseña');

        let socioEncontrado = listaSocios.find(socio =>
            socio.nombre.toLowerCase() === nombreUsuario.split(' ')[0].toLowerCase() &&
            socio.apellido.toLowerCase() === nombreUsuario.split(' ')[1].toLowerCase() &&
            socio.contraseña === contraseña
        );

        if (socioEncontrado) {
            descuento = total * 0.10;
            total = total * 0.90;
        }

        document.getElementById("total").innerHTML = `<div class="total">
                                                        <p>Descuento: $${descuento.toFixed(2)}</p>
                                                        <p>Total: $${total.toFixed(2)}</p>
                                                      </div>`;
    }

    function agregarUnidad(e) {
        const index = e.target.getAttribute('data-index');
        carrito[index].cantidad += 1;
        actualizarCarrito();
    }

    function quitarUnidad(e) {
        const index = e.target.getAttribute('data-index');
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad -= 1;
        } else {
            carrito.splice(index, 1);
        }
        actualizarCarrito();
    }

    function borrarProducto(e) {
        const index = e.target.getAttribute('data-index');
        carrito.splice(index, 1);
        actualizarCarrito();
    }

    function verificarSocio() {
        let nombreUsuario = localStorage.getItem('nombreUsuario');
        let contraseña = localStorage.getItem('contraseña');
        
        if (nombreUsuario && contraseña) {
            let nombreArray = nombreUsuario.toLowerCase().split(' ');
            let socioEncontrado = listaSocios.find(socio =>
                socio.nombre === nombreArray[0] &&
                socio.apellido === nombreArray[1] &&
                socio.contraseña === contraseña
            );
            return socioEncontrado ? true : false;
        }
        return false;
    }

    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const producto = {
                img: e.target.parentElement.previousElementSibling.src,
                nombre: e.target.parentElement.children[1].innerText,
                precio: parseFloat(e.target.parentElement.children[2].innerText.replace('$', '')),
                cantidad: 1
            };
            agregarAlCarrito(producto);
        });
    });

    cerrarCarrito.addEventListener('click', () => {
        carritoOffCanvas.classList.remove('show');
        carritoOverlay.style.display = 'none';
    });

    carritoOverlay.addEventListener('click', () => {
        carritoOffCanvas.classList.remove('show');
        carritoOverlay.style.display = 'none';
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btnBorrar')) {
            borrarProducto(e);
        }
        if (e.target.classList.contains('btnAgregarUnidad')) {
            agregarUnidad(e);
        }
        if (e.target.classList.contains('btnQuitarUnidad')) {
            quitarUnidad(e);
        }
    });

    // Abrir carrito
    const carritoBoton = document.querySelector('.cart-btn');
    if (carritoBoton) {
        carritoBoton.addEventListener('click', () => {
            carritoOffCanvas.classList.add('show');
            carritoOverlay.style.display = 'block';
        });
    }

    // Inicializar el carrito
    window.onload = function() {
        let usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
        if (usuariosRegistrados.length > 0) {
            listaSocios = usuariosRegistrados;
        }
        socio = verificarSocio();
        actualizarCarrito();
    }
});


