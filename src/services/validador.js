// SRP: Responsabilidad única de validación
class Validador {
  static validarNombre(nombre) {
    if (!nombre || typeof nombre !== "string") {
      return { valido: false, mensaje: "El nombre debe ser una cadena de texto" }
    }

    if (nombre.trim().length === 0) {
      return { valido: false, mensaje: "El nombre no puede estar vacío" }
    }

    if (nombre.length > 20) {
      return { valido: false, mensaje: "El nombre no puede tener más de 20 caracteres" }
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
      return { valido: false, mensaje: "El nombre solo puede contener letras y espacios" }
    }

    return { valido: true, mensaje: "Nombre válido" }
  }

  static validarNivel(nivel) {
    if (!Number.isInteger(nivel) || nivel < 1 || nivel > 100) {
      return { valido: false, mensaje: "El nivel debe ser un número entero entre 1 y 100" }
    }
    return { valido: true, mensaje: "Nivel válido" }
  }

  static validarEstadistica(valor, nombre, min = 0, max = 1000) {
    if (!Number.isInteger(valor) || valor < min || valor > max) {
      return {
        valido: false,
        mensaje: `${nombre} debe ser un número entero entre ${min} y ${max}`,
      }
    }
    return { valido: true, mensaje: `${nombre} válido` }
  }
}

module.exports = { Validador }
