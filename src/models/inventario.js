const { GeneradorItems } = require("./item")

class Inventario {
  constructor() {
    this.items = new Map() // nombre del item -> cantidad
    this.itemsDisponibles = GeneradorItems.crearItemsBasicos()

    // Dar algunos items iniciales
    this.agregarItem("Poción de Vida", 3)
    this.agregarItem("Poción de Mana", 2)
  }

  agregarItem(nombreItem, cantidad = 1) {
    const cantidadActual = this.items.get(nombreItem) || 0
    this.items.set(nombreItem, cantidadActual + cantidad)
  }

  usarItem(nombreItem) {
    const cantidad = this.items.get(nombreItem) || 0
    if (cantidad > 0) {
      this.items.set(nombreItem, cantidad - 1)
      if (this.items.get(nombreItem) === 0) {
        this.items.delete(nombreItem)
      }
      return this.obtenerItem(nombreItem)
    }
    return null
  }

  obtenerItem(nombreItem) {
    return this.itemsDisponibles.find((item) => item.nombre === nombreItem)
  }

  obtenerItemsDisponibles() {
    return Array.from(this.items.entries())
      .filter(([nombre, cantidad]) => cantidad > 0)
      .map(([nombre, cantidad]) => {
        const item = this.obtenerItem(nombre)
        return {
          nombre: nombre,
          cantidad: cantidad,
          descripcion: item ? item.descripcion : "Item desconocido",
        }
      })
  }

  tieneItems() {
    return this.items.size > 0
  }
}

module.exports = { Inventario }
