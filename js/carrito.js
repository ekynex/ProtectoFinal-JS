document.addEventListener('DOMContentLoaded', function() {
    const carritoOffCanvas = document.getElementById('carritoOffCanvas');
    const carritoOverlay = document.getElementById('carritoOverlay');
    const cerrarCarrito = document.getElementById('cerrarCarrito');
    const botonesAgregar = document.querySelectorAll('.product-btn');
    
    
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarCarrito);
    });

    cerrarCarrito.addEventListener('click', () => {
        carritoOffCanvas.classList.remove('show');
        carritoOverlay.style.display = 'none';
    });

    carritoOverlay.addEventListener('click', () => {
        carritoOffCanvas.classList.remove('show');
        carritoOverlay.style.display = 'none';
    });
   
    let listaSocios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [
        {nombre: "matias", apellido: "ponce", contraseña:"argentina"},
        {nombre: "nicolas", apellido: "ponce", contraseña:"peru"},
        {nombre: "santiago", apellido: "zapata", contraseña:"colombia"},
        {nombre: "seomara", apellido: "funes", contraseña:"venezuela"},
        {nombre: "madeleine", apellido: "velazques", contraseña:"brasil"}
    ];

    let carrito = [];
    let socio = false;

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

    socio = verificarSocio();

    function agregarCarrito(e){
        let hijo = e.target;
        let padre = hijo.parentNode;
        let abuelo = padre.parentNode;
        
        let nombreProducto = padre.querySelector("h3").textContent;
        let precioProducto = parseFloat(padre.querySelector("h5").textContent.replace('$', ''));    
        let imgProducto = abuelo.querySelector("img").src;

        let producto = {
            nombre: nombreProducto, 
            precio: precioProducto, 
            cantidad:1, 
            img:imgProducto
        };

        let productoExistente = carrito.find(item => item.nombre === producto.nombre);

        if (productoExistente){
            productoExistente.cantidad++;
        } else {
            carrito.push(producto);
        }    
        
        mostrarCarrito();

        // Mostrar el carrito y el overlay
        carritoOffCanvas.classList.add('show');
        carritoOverlay.style.display = 'block';
    }

    function mostrarCarrito(){
        let tabla = document.getElementById("tbody");
        tabla.innerHTML = "";

        for(let producto of carrito){
            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td><img width="50px" src="${producto.img}"></td>
                <td class="productName"><p>${producto.nombre}</p></td>
                <td><button class="btnQuitarUnidad">-</button><p class="third-row">${producto.cantidad}</p><button class="btnAgregarUnidad">+</button></td>
                <td class="priceCart">${producto.precio}</td>
                <td><button class="btnBorrar">X</button></td>
            `;
            tabla.append(fila);
        }

        let btnEliminar = document.querySelectorAll(".btnBorrar");
        btnEliminar.forEach(boton => boton.addEventListener("click", borrarProducto));

        let btnQuitarUnidad = document.querySelectorAll(".btnQuitarUnidad");
        btnQuitarUnidad.forEach(boton => boton.addEventListener("click", quitarUnidad));

        let btnAgregarUnidad = document.querySelectorAll(".btnAgregarUnidad");
        btnAgregarUnidad.forEach(boton => boton.addEventListener("click", agregarUnidad));

        mostrarTotal();
    }

    function borrarProducto(e) {
        let abuelo = e.target.parentNode.parentNode;
        let productoEliminar = abuelo.querySelector("p").textContent;
        carrito = carrito.filter(producto => producto.nombre !== productoEliminar);

        mostrarCarrito();
    }

    function quitarUnidad(e) {
        let abuelo = e.target.closest('tr'); // Encuentra el abuelo más cercano, que es la fila de la tabla
        let productoNombre = abuelo.querySelector("p").textContent;
        
        let producto = carrito.find(item => item.nombre === productoNombre);

        if (producto) {
            producto.cantidad--;
            if (producto.cantidad === 0) {
                carrito = carrito.filter(item => item.nombre !== productoNombre);
            }
        }

        mostrarCarrito();
    }

    function agregarUnidad(e) {
        let abuelo = e.target.closest('tr'); // Encuentra el abuelo más cercano, que es la fila de la tabla
        let productoNombre = abuelo.querySelector("p").textContent;
        
        let producto = carrito.find(item => item.nombre === productoNombre);

        if (producto) {
            producto.cantidad++;
        }

        mostrarCarrito();
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

    window.onload = function() {
        let usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
        if (usuariosRegistrados.length > 0) {
            listaSocios = usuariosRegistrados;
        }
        socio = verificarSocio();
    }
});
