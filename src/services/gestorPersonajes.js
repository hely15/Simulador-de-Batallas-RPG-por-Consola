const { guardarPersonaje, cargarPersonajes } = require("./db")
const { Mago } = require("../models/mago")
const { Guerrero } = require("../models/guerrero")
const { Arquero } = require("../models/arquero")
const { Inventario } = require("../models/inventario")
const { NotificadorConsola } = require("./notificador")
const inquirer = require("inquirer").default

// SRP: Gestión específica de personajes
class GestorPersonajes {
  constructor(notificador = new NotificadorConsola()) {
    this.notificador = notificador
    this.clasesDisponibles = {
      Mago: Mago,
      Guerrero: Guerrero,
      Arquero: Arquero,
    }
  }

  async crearPersonaje() {
    const { nombre } = await inquirer.prompt([
      {
        type: "input",
        name: "nombre",
        message: "Ingresa el nombre del personaje:",
        validate: (input) => input.trim() !== "" || "El nombre no puede estar vacío",
      },
    ])

    const { clase } = await inquirer.prompt([
      {
        type: "list",
        name: "clase",
        message: "Elige la clase del personaje:",
        choices: Object.keys(this.clasesDisponibles),
      },
    ])

    const ClasePersonaje = this.clasesDisponibles[clase]
    const personaje = new ClasePersonaje(nombre)

    // Agregar inventario al personaje
    personaje.inventario = new Inventario()

    await guardarPersonaje(personaje)
    this.notificador.notificar(`Personaje ${nombre} creado como ${clase}`, "exito")

    return personaje
  }

  async cargarPersonaje() {
    const personajes = await cargarPersonajes()

    if (personajes.length === 0) {
      this.notificador.notificar("No hay personajes guardados", "advertencia")
      return null
    }

    const { seleccionado } = await inquirer.prompt([
      {
        type: "list",
        name: "seleccionado",
        message: "Elige tu personaje:",
        choices: personajes.map((p) => `${p.nombre} - ${p.clase} (Nivel ${p.nivel})`),
      },
    ])

    const [nombreSeleccionado] = seleccionado.split(" - ")
    const personajeData = personajes.find((p) => p.nombre === nombreSeleccionado)

    return this.reconstruirPersonaje(personajeData)
  }

  reconstruirPersonaje(data) {
    const ClasePersonaje = this.clasesDisponibles[data.clase]
    const personaje = new ClasePersonaje(data.nombre)

    // Restaurar estadísticas
    personaje.nivel = Number.parseInt(data.nivel)
    personaje.vida = Number.parseInt(data.vida.split("/")[0])
    personaje.mana = Number.parseInt(data.mana.split("/")[0])
    personaje.experiencia = Number.parseInt(data.experiencia.split("/")[0])

    // Restaurar inventario
    personaje.inventario = new Inventario()

    // Restaurar propiedades específicas de clase
    if (data.grimorio && personaje.grimorio) {
      personaje.grimorio = data.grimorio
    }
    if (data.flechas && personaje.flechas !== undefined) {
      personaje.flechas = data.flechas
    }

    this.notificador.notificar(`Personaje ${personaje.nombre} cargado`, "exito")
    return personaje
  }

  mostrarEstadisticas(personaje) {
    const info = personaje.obtenerInformacion()

    this.notificador.mostrarTitulo(`Estadísticas de ${info.nombre}`)
    console.log(`Clase: ${info.clase}`)
    console.log(`Nivel: ${info.nivel}`)
    console.log(`Vida: ${info.vida}`)
    console.log(`Mana: ${info.mana}`)
    console.log(`Ataque: ${info.ataque}`)
    console.log(`Defensa: ${info.defensa}`)
    console.log(`Velocidad: ${info.velocidad}`)
    console.log(`Experiencia: ${info.experiencia}`)
    console.log(`Especialidad: ${info.especialidad}`)
    console.log(`Habilidades: ${info.habilidades.join(", ")}`)

    if (info.grimorio) {
      console.log(`Grimorio: ${info.grimorio.join(", ")}`)
    }
    if (info.flechas) {
      console.log(`Flechas: ${info.flechas}`)
    }
  }
}

module.exports = { GestorPersonajes }
