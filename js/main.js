/* PÁGINA DE INICIO */

// ------------------------------------------------
/* REGISTRO E INICIO DE SESIÓN */
// Global
const patronRut = /^\d{7,8}-[0-9kK]$/;
let sesionIniciada = JSON.parse(localStorage.getItem('sesionIniciada'));
const navMenuBotonSesion = document.getElementById("header_nav_menu_item_linksesion");
navMenuBotonSesion.innerText = sesionIniciada ? 'Cerrar sesión' : 'Iniciar sesión';

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