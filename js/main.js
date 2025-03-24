/* PÁGINA DE INICIO */
let sesionIniciada;
let datosMostrados = false;

const mainLibros = document.getElementById('main_libros');
const libros = await obtenerLibros();
mostrarLibros(libros);

const campoBusqueda = document.getElementById('header_nav_menu_item_search');
campoBusqueda?.addEventListener("keyup", () => filtrarLibros());

const ordenador = document.getElementById('header_nav_menu_item_sorter');
ordenador?.addEventListener('change', () => ordenarLibrosAlfabeticamente(ordenador.value));

configurarSesion();
configurarRegistro();
configurarInicioSesion();

async function obtenerLibros() {
    try {
        const response = await fetch('/js/libros.json');
		let librosPromesaResuelta= await response.json();
		return librosPromesaResuelta.map(el => new Libro(el.nombreArchivo, el.titulo, el.autor, el.editorial, el.ano_publicacion, el.tematica, el.resena));
    } catch (error) {
        console.error('Error cargando libros.json:', error);
    }
}

function mostrarLibros(arrayLibros) {
    if (mainLibros) mainLibros.innerHTML = '';
    arrayLibros.forEach(libro => {
        const figuraLibro = crearFiguraLibro(libro);
        mainLibros?.appendChild(figuraLibro);
    });
}

function crearFiguraLibro(libro) {
    const figuraLibro = document.createElement('figure');
    figuraLibro.className = 'main_libros_figura';

    const portadaLibro = document.createElement('img');
    portadaLibro.className = 'main_libros_figura_portada';
    portadaLibro.src = `/img/portadas/${libro.nombreArchivo.replace('.pdf', '.jpg')}`;
    portadaLibro.alt = `Cubierta del libro ${libro.titulo}, de ${libro.autor}`;
    figuraLibro.appendChild(portadaLibro);

    const tituloLibro = document.createElement('figcaption');
    tituloLibro.className = 'main_libros_figura_titulo';
    tituloLibro.innerHTML = `${libro.autor} - ${libro.titulo}<br>(${libro.tematica})`;

    figuraLibro.addEventListener('click', () => mostrarDatosDeLibro(libro));
    figuraLibro.appendChild(tituloLibro);

    return figuraLibro;
}

function mostrarDatosDeLibro(libro) {
    const anteriorContenedorDatosLibro = document.getElementById('main_libros_datos');
    anteriorContenedorDatosLibro?.remove();
    const contenedorDatosLibro = document.createElement('div');
    contenedorDatosLibro.className = 'main_libros_datos';
    contenedorDatosLibro.id = 'main_libros_datos';
    if (datosMostrados) {
        contenedorDatosLibro.innerHTML = "";
        datosMostrados = false;
    } else {
        contenedorDatosLibro.innerHTML = `
            <h2>${libro.titulo}</h2>
            <img src="/img/portadas/${libro.nombreArchivo.replace('.pdf', '.jpg')}" alt="Cubierta del libro ${libro.titulo}, de ${libro.autor}">
            <p><strong>Autor:</strong> ${libro.autor}</p>
            <p><strong>Editorial:</strong> ${libro.editorial}</p>
            <p><strong>Año de publicación:</strong> ${libro.ano_publicacion}</p>
            <p><strong>Temática:</strong> ${libro.tematica}</p>
            <p><strong>Reseña:</strong> ${libro.resena}</p>
            <a id="main_libros_datos_descarga" href="/libros/${libro.nombreArchivo}" download="${libro.nombreArchivo}">Descargar</a>
        `;
        datosMostrados = true;
    }
    mainLibros.appendChild(contenedorDatosLibro);
    const botonDescarga = document.getElementById('main_libros_datos_descarga');
    botonDescarga?.addEventListener('click', (e) => {
        if (!sesionIniciada) {
            e.preventDefault();
            alert('Para descargar el libro, inicie sesión.');
            window.location.href = 'pages/inicio_de_sesion.html';
        }
    });
}

function filtrarLibros() {
    const consulta = campoBusqueda.value.toLowerCase();
    const librosFiltrados = libros.filter(libro => {
        return Object.values(libro).some(valor => valor.toString().toLowerCase().includes(consulta));
    });
    mostrarLibros(librosFiltrados);
}

function ordenarLibrosAlfabeticamente(criterio) {
    if (criterio !== "default") {
        const librosOrdenados = libros.sort((a, b) => a[criterio].localeCompare(b[criterio]));
        mostrarLibros(librosOrdenados);
    }
}

/* REGISTRO E INICIO DE SESIÓN */
const patronRut = /^\d{7,8}-[0-9kK]$/;
sesionIniciada = JSON.parse(localStorage.getItem('sesionIniciada'));

function configurarSesion() {
    const navMenuBotonSesion = document.getElementById("header_nav_menu_item_linksesion");
    navMenuBotonSesion.innerText = sesionIniciada ? 'Cerrar sesión' : 'Inicio de sesión';

    navMenuBotonSesion.addEventListener('click', () => {
        if (sesionIniciada) {
            localStorage.setItem('sesionIniciada', false);
            alert('¡Sesión cerrada!');
            window.location.href = '../index.html';
        } else {
            window.location.href = '../pages/inicio_de_sesion.html';
        }
    });
}

function validar(rut, contrasena1, contrasena2) {
    const algunCampoVacio = rut.value === '' || contrasena1.value === '' || (contrasena2 && contrasena2.value === '');
    const rutInvalido = !patronRut.test(rut.value);
    const contrasenasNoCoinciden = contrasena2 && contrasena1.value !== contrasena2.value;

    if (algunCampoVacio) {
        alert('Por favor, complete todos los campos.');
    } else if (rutInvalido) {
        alert('RUT inválido.');
    } else if (contrasenasNoCoinciden) {
        alert('Las contraseñas no coinciden.');
    } else {
        return true;
    }
}

function configurarRegistro() {
    const m_fr_rut = document.getElementById('main_formularioregistro_rut');
    const m_fr_contrasena1 = document.getElementById('main_formularioregistro_contrasena1');
    const m_fr_contrasena2 = document.getElementById('main_formularioregistro_contrasena2');
    const m_fr_botonRegistro = document.getElementById('main_formularioregistro_botonregistro');

    m_fr_rut?.addEventListener('focusout', () => m_fr_rut.style.borderColor = patronRut.test(m_fr_rut.value) ? 'inherit' : 'red');
    m_fr_botonRegistro?.addEventListener('click', () => registrarse(m_fr_rut, m_fr_contrasena1, m_fr_contrasena2));
}

function registrarse(rut, contrasena1, contrasena2) {
    if (validar(rut, contrasena1, contrasena2)) {
        const usuario = new Usuario(rut.value, contrasena1.value);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        alert('¡Registro exitoso!');
        window.location.href = '../index.html';
    }
}

function configurarInicioSesion() {
    const m_fl_rut = document.getElementById('main_formulariologin_rut');
    const m_fl_contrasena = document.getElementById('main_formulariologin_contrasena');
    const m_fl_botonlogin = document.getElementById('main_formulariologin_botonlogin');

	m_fl_rut?.addEventListener('focusout', () => m_fl_rut.style.borderColor = patronRut.test(m_fl_rut.value) ? 'inherit' : 'red');
    m_fl_botonlogin?.addEventListener('click', () => iniciarSesion(m_fl_rut, m_fl_contrasena));
}

function iniciarSesion(rut, contrasena) {
    if (validar(rut, contrasena)) {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (usuario && usuario.rut === rut.value && usuario.contrasena === contrasena.value) {
            sesionIniciada = true;
            localStorage.setItem('sesionIniciada', true);
            alert('¡Inicio de sesión exitoso!');
            window.location.href = '../index.html';
        } else {
            alert('RUT o contraseña incorrectos.');
        }
    }
}