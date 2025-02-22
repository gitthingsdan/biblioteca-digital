/* PÁGINA DE INICIO */
const navMenuBotonSesion = document.getElementById("header_nav_menu_item_linksesion");

/* REGISTRO */
// Variables
const patronRut = /^\d{7,8}-[0-9kK]$/;
const rut = document.getElementById('main_formularioregistro_rut');
const contrasena1 = document.getElementById('main_formularioregistro_contrasena1');
const contrasena2 = document.getElementById('main_formularioregistro_contrasena2');
const botonRegistro = document.getElementById('main_formularioregistro_botonregistro');

// "Event listeners"
rut?.addEventListener('focusout', () => {
	if (!patronRut.test(rut.value)) {
		rut.style.borderColor = 'red';
	} else {
		rut.style.borderColor = 'inherit';
	};
});
botonRegistro?.addEventListener('click', registrarse);

// Funciones
function registrarse() {
	if (rut.value === '' || contrasena1.value === '' || contrasena2.value === '') {
		alert('Por favor, complete todos los campos.');
	} else if (!patronRut.test(rut.value)) {
		alert('RUT inválido.');
	} else if (contrasena1.value !== contrasena2.value) {
		alert('Las contraseñas no coinciden.');
	} else {
		const usuario = new Usuario(rut.value, contrasena1.value);
		localStorage.setItem('usuario', JSON.stringify(usuario));
		alert('¡Registro exitoso!');
		setTimeout(() => window.location.href = '../index.html', 3000);
	}
}

/* INICIO DE SESIÓN */
// Variables

// Funciones
function iniciarSesion() {

}