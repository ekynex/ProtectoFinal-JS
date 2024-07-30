document.addEventListener('DOMContentLoaded', function() {
    const carritoOffCanvas = document.getElementById('carritoOffCanvas');
    const carritoOverlay = document.getElementById('carritoOverlay');
    const cerrarCarrito = document.getElementById('cerrarCarrito');
    let productos = []; 
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Lista de socios
    let listaSocios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [
        {nombre: "matias", apellido: "ponce", contraseña:"argentina"},
        {nombre: "nicolas", apellido: "ponce", contraseña:"peru"},
        {nombre: "santiago", apellido: "zapata", contraseña:"colombia"},
        {nombre: "seomara", apellido: "funes", contraseña:"venezuela"},
        {nombre: "madeleine", apellido: "velazques", contraseña:"brasil"}
    ];

    // Cargar los productos del archivo JSON
    fetch('../js/productos.json')
        .then(response => response.json())
        .then(data => {
            productos = data;
            inicializarBotonesAgregar();
        })
        .catch(error => console.error('Error al cargar el JSON:', error));

    function inicializarBotonesAgregar() {
        const botonesAgregar = document.querySelectorAll('.product-btn');
        botonesAgregar.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const idProducto = e.target.getAttribute('data-id');
                const producto = productos.find(p => p.id === idProducto);
                if (producto) {
                    agregarAlCarrito(producto);
                }
            });
        });
    }

    function actualizarCarrito() {
        const tbody = document.getElementById('tbody');
        tbody.innerHTML = '';
        carrito.forEach((producto, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><img width="50px" src="${producto.img || ''}" alt="${producto.nombre}"></td>
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

        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function agregarAlCarrito(producto) {
        const index = carrito.findIndex(item => item.id === producto.id);
        if (index > -1) {
            carrito[index].cantidad += 1;
        } else {
            carrito.push({...producto, cantidad: 1});
        }
        actualizarCarrito();

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

    const carritoBoton = document.querySelector('.cart-btn');
    if (carritoBoton) {
        carritoBoton.addEventListener('click', () => {
            carritoOffCanvas.classList.add('show');
            carritoOverlay.style.display = 'block';
        });
    }

    window.onload = function() {
        let usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
        if (usuariosRegistrados.length > 0) {
            listaSocios = usuariosRegistrados;
        }
        socio = verificarSocio();
        actualizarCarrito();
    }
});
