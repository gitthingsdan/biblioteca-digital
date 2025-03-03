class Libro {
	constructor(nombreArchivo, titulo, autor, editorial, ano_publicacion, tematica, resena) {
		this.nombreArchivo = nombreArchivo;
		this.titulo = titulo;
		this.autor = autor;
		this.editorial = editorial;
		this.ano_publicacion = ano_publicacion;
		this.tematica = tematica;
		this.resena = resena;
	}
}

class Usuario {
	constructor(rut, contrasena) {
		this.rut = rut;
		this.contrasena = contrasena;
	}
}