// Obtener referencias a los botones de registro e inicio de sesión
const container = document.querySelector(".iniReg-container");
const btnregistro = document.getElementById("insBtn");
const btniniciar = document.getElementById("iniBtn");

// Mostrar formulario de registro
btnregistro.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

// Mostrar formulario de inicio de sesión
btniniciar.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

// Lista de socios inicial
let listaSocios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [
    {nombre: "matias", apellido: "ponce", contraseña:"argentina"},
    {nombre: "nicolas", apellido: "ponce", contraseña:"peru"},
    {nombre: "santiago", apellido: "zapata", contraseña:"colombia"},
    {nombre: "seomara", apellido: "funes", contraseña:"venezuela"},
    {nombre: "madeleine", apellido: "Velazques", contraseña:"brasil"}
];

/* Función para validar el inicio de sesión */
function validar() {
    let nombreUsuario = document.getElementById("nombreUsuario").value.trim().toLowerCase();
    let password = document.getElementById("contraseña").value.trim();

    let nombre = nombreUsuario.split(' ')[0];
    let apellido = nombreUsuario.split(' ')[1];

    let socioEncontrado = listaSocios.find(socio =>
        socio.nombre.toLowerCase() === nombre &&
        socio.apellido.toLowerCase() === apellido &&
        socio.contraseña === password
    );

    if (socioEncontrado) {
        const nombreCompleto = `${socioEncontrado.nombre} ${socioEncontrado.apellido}`;
        localStorage.setItem('nombreUsuario', nombreCompleto);
        localStorage.setItem('contraseña', password);

        window.location.href = "../index.html";
    } else {
        document.getElementById("msj").innerHTML = `<h2>ERROR DE USUARIO</h2>
            <p>El usuario ${nombreUsuario} no existe o la contraseña es incorrecta</p>`;
    }

    return false;
}

/* Función para mostrar el nombre del usuario */
function mostrarNombre() {
    const nombreCompleto = localStorage.getItem('nombreUsuario');
    const loginBtn = document.getElementById('loginBtn');
    const welcomeMsg = document.getElementById('welcomeMsg');
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');

    if (nombreCompleto) {
        loginBtn.style.display = 'none';
        welcomeMsg.style.display = 'block';
        userName.textContent = nombreCompleto;
        logoutBtn.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        welcomeMsg.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
}

/* Función para cerrar sesión */
function cerrarSesion() {
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('contraseña');
    window.location.reload();
}

/* Inicialización al cargar la página */
document.addEventListener('DOMContentLoaded', function() {
    mostrarNombre();
    document.getElementById('logoutBtn').addEventListener('click', cerrarSesion);
});

/* Registro de nuevos usuarios */
document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombreRegistro').value.trim().toLowerCase();
    const apellido = document.getElementById('apellidoRegistro').value.trim().toLowerCase();
    const password = document.getElementById('contraseñaNueva').value.trim();

    if (nombre && apellido && password) {
        const nuevoSocio = {
            nombre: nombre,
            apellido: apellido,
            contraseña: password
        };

        listaSocios.push(nuevoSocio);
        localStorage.setItem('usuariosRegistrados', JSON.stringify(listaSocios));

        document.getElementById('nombreRegistro').value = "";
        document.getElementById('apellidoRegistro').value = "";
        document.getElementById('contraseñaNueva').value = "";

        Swal.fire({
            title: "Registro exitoso",
            text: "¡Navega en nuestra tienda y conócenos!",
            icon: "success",
            timer: 1500
        });

        setTimeout( ()=> {
            window.location.href = "../pages/inicioyregistro.html";
        }, 3000);
        
    } else {
        alert('Por favor, completa todos los campos.');
    }
});

console.log('lista de socios:', listaSocios);
