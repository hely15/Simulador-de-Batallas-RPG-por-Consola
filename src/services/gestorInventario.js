const { Inventario } = require("../models/inventario")
const { NotificadorConsola } = require("./notificador")
const inquirer = require("inquirer").default

class GestorInventario {
  constructor(notificador = new NotificadorConsola()) {
    this.notificador = notificador
  }

  async mostrarInventario(personaje) {
    if (!personaje.inventario || !personaje.inventario.tieneItems()) {
      this.notificador.notificar("Tu inventario está vacío", "advertencia")
      return null
    }

    const items = personaje.inventario.obtenerItemsDisponibles()
    const opciones = items.map((item) => `${item.nombre} (${item.cantidad}) - ${item.descripcion}`)
    opciones.push("Cancelar")

    const { seleccion } = await inquirer.prompt([
      {
        type: "list",
        name: "seleccion",
        message: "¿Qué item deseas usar?",
        choices: opciones,
      },
    ])

    if (seleccion === "Cancelar") return null
    const nombreItem = seleccion.split(" (")[0]
    return this.usarItem(personaje, nombreItem)
  }

  usarItem(personaje, nombreItem) {
    const item = personaje.inventario.usarItem(nombreItem)
    if (!item) {
      this.notificador.notificar("No tienes ese item", "error")
      return null
    }
    const resultado = item.usar(personaje)
    this.notificador.notificar(resultado.mensaje, resultado.exito ? "exito" : "error")
    return resultado
  }

  agregarItemAleatorio(personaje) {
    const itemsComunes = ["Poción de Vida", "Poción de Mana", "Elixir de Fuerza"]
    const itemAleatorio = itemsComunes[Math.floor(Math.random() * itemsComunes.length)]
    personaje.inventario.agregarItem(itemAleatorio, 1)
    this.notificador.notificar(`Has encontrado: ${itemAleatorio}`, "exito")
  }
}

module.exports = { GestorInventario }
