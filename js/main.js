/* PÁGINA DE INICIO */
let mainLibros, libros, campoBusqueda;
let datosMostrados = false;
if (window.location.href.includes('index.html') || window.location.href === "http://localhost:3000/") {
	mainLibros = document.getElementById('main_libros');
	libros = await obtenerLibros();
	mostrarLibros(libros);
	
	campoBusqueda = document.getElementById('header_nav_menu_item_search');
	campoBusqueda?.addEventListener("keyup", () => filtrarLibros()); /* Me gustaría entender por qué la consulta se captura correctamente con "keyup" y no "keydown" */

	const ordenador = document.getElementById('header_nav_menu_item_sorter');
	ordenador?.addEventListener('change', () => ordenarLibrosAlfabeticamente(ordenador.value));
}

async function obtenerLibros() {
	try {
		const response = await fetch('js/libros.json');
		let libros = await response.json();
		libros = libros.map(el => new Libro(el.nombreArchivo, el.titulo, el.autor, el.editorial, el.ano_publicacion, el.tematica, el.resena));
		return libros;
	} catch (error) {
		console.error('Error cargando libros.json:', error);
	}
}

function mostrarLibros(arrayLibros) {
	mainLibros.innerHTML = '';
	arrayLibros.forEach(libro => {
		let figuraLibro = document.createElement('figure');
		figuraLibro.className = 'main_libros_figura';

		let portadaLibro = document.createElement('img');
		portadaLibro.className = 'main_libros_figura_portada';
		portadaLibro.src = `img/portadas/${libro.nombreArchivo.replace('.pdf', '.jpg')}`;
		portadaLibro.alt = `Cubierta del libro ${libro.titulo}, de ${libro.autor}`;
		figuraLibro.appendChild(portadaLibro);

		let tituloLibro = document.createElement('figcaption');
		tituloLibro.className = 'main_libros_figura_titulo';
		tituloLibro.innerHTML = `${libro.autor} - ${libro.titulo}<br>(${libro.tematica})`;

		figuraLibro.addEventListener('click', () => {
			mostrarDatosDeLibro(libro);
		});
		figuraLibro.appendChild(tituloLibro);

		mainLibros.appendChild(figuraLibro);
	});
}

function mostrarDatosDeLibro(libro) {
	const anteriorContenedorDatosLibro = document.getElementById('main_libros_datos');
	anteriorContenedorDatosLibro?.remove();
	const contenedorDatosLibro = document.createElement('div');
	contenedorDatosLibro.className = 'main_libros_datos';
	contenedorDatosLibro.id = 'main_libros_datos';
	if (datosMostrados) {
		contenedorDatosLibro.innerHTML = ""
		datosMostrados = false;
	} else {
		contenedorDatosLibro.innerHTML = `
			<h2>${libro.titulo}</h2>
			<img src="img/portadas/${libro.nombreArchivo.replace('.pdf', '.jpg')}" alt="Cubierta del libro ${libro.titulo}, de ${libro.autor}">
			<p><strong>Autor:</strong> ${libro.autor}</p>
			<p><strong>Editorial:</strong> ${libro.editorial}</p>
			<p><strong>Año de publicación:</strong> ${libro.ano_publicacion}</p>
			<p><strong>Temática:</strong> ${libro.tematica}</p>
			<p><strong>Reseña:</strong> ${libro.resena}</p>
			<a id="main_libros_datos_descarga" href="libros/${libro.nombreArchivo}" download="${libro.nombreArchivo}">Descargar</a>
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
	let consulta = campoBusqueda.value;

	// Sugerencia de Copilot:
	let librosFiltrados = libros.filter(libro => {
		return Object.values(libro).some(valor => {
			let valorMinusculas = valor.toString().toLowerCase();
			let consultaMinusculas = consulta.toLowerCase();
			return valorMinusculas.includes(consultaMinusculas);
		});
	});

	mostrarLibros(librosFiltrados);
}

function ordenarLibrosAlfabeticamente(criterio) {
	if (criterio !== "default") {
		let librosOrdenados = libros.sort((a, b) => a[criterio].localeCompare(b[criterio]));
		mostrarLibros(librosOrdenados);		
	}
}

// ------------------------------------------------
/* REGISTRO E INICIO DE SESIÓN */
// Global (Registro e inicio de sesión)
const patronRut = /^\d{7,8}-[0-9kK]$/;
let sesionIniciada = JSON.parse(localStorage.getItem('sesionIniciada'));
const navMenuBotonSesion = document.getElementById("header_nav_menu_item_linksesion");
navMenuBotonSesion.innerText = sesionIniciada ? 'Cerrar sesión' : 'Inicio de sesión';

navMenuBotonSesion.addEventListener('click', () => {
	if (sesionIniciada) {
		localStorage.setItem('sesionIniciada', !sesionIniciada);
		alert('¡Sesión cerrada!');
		window.location.href = '../index.html';
	} else {
		window.location.href = '../pages/inicio_de_sesion.html';
	}
});

function validar(rut, contrasena1, contrasena2) {
	// Validaciones
	const algunCampoVacio = rut.value === '' || contrasena1.value === '' || (contrasena2 && contrasena2.value === '');
	const rutInvalido = !patronRut.test(rut.value);
	const contrasenasNoCoinciden = contrasena2 && contrasena1.value !== contrasena2.value;
	// ------------------------------------------------
	// Mensajes de error
	if (algunCampoVacio) {
		alert('Por favor, complete todos los campos.');
	} else if (rutInvalido) {
		alert('RUT inválido.');
	} else if (contrasenasNoCoinciden) {
		alert('Las contraseñas no coinciden.');
	} else return true;
}

// Registro
const m_fr_rut = document.getElementById('main_formularioregistro_rut');
const m_fr_contrasena1 = document.getElementById('main_formularioregistro_contrasena1');
const m_fr_contrasena2 = document.getElementById('main_formularioregistro_contrasena2');
const m_fr_botonRegistro = document.getElementById('main_formularioregistro_botonregistro');

m_fr_rut?.addEventListener('focusout', () => m_fr_rut.style.borderColor = patronRut.test(m_fr_rut.value) ? 'inherit' : 'red');
m_fr_botonRegistro?.addEventListener('click', () => registrarse(m_fr_rut, m_fr_contrasena1, m_fr_contrasena2));

function registrarse(rut, contrasena1, contrasena2) {
	validar(rut, contrasena1, contrasena2);
	const usuario = new Usuario(m_fr_rut.value, m_fr_contrasena1.value);
	localStorage.setItem('usuario', JSON.stringify(usuario));
	alert('¡Registro exitoso!');
	window.location.href = '../index.html';
}

// Inicio de sesión
const m_fl_rut = document.getElementById('main_formulariologin_rut');
const m_fl_contrasena = document.getElementById('main_formulariologin_contrasena');
const m_fl_botonlogin = document.getElementById('main_formulariologin_botonlogin');

m_fl_botonlogin?.addEventListener('click', () => iniciarSesion(m_fl_rut, m_fl_contrasena));

function iniciarSesion(rut, contrasena) {
	const validado = validar(rut, contrasena);
	if (validado) {
		const usuario = JSON.parse(localStorage.getItem('usuario'));
		if (usuario.rut === rut.value && usuario.contrasena === contrasena.value) {
			sesionIniciada = true;
			localStorage.setItem('sesionIniciada', sesionIniciada);
			alert('¡Inicio de sesión exitoso!');
			window.location.href = '../index.html';
		} else {
			alert('RUT o contraseña incorrectos.');
		}
	}
}