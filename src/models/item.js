class Item {
  constructor(nombre, tipo, efecto, valor, descripcion) {
    this.nombre = nombre
    this.tipo = tipo // 'consumible', 'equipable', 'especial'
    this.efecto = efecto // 'curar', 'mana', 'ataque', 'defensa'
    this.valor = valor // cantidad del efecto
    this.descripcion = descripcion
  }

  usar(personaje) {
    switch (this.efecto) {
      case "curar":
        const vidaAnterior = personaje.vida
        personaje.vida = Math.min(personaje.vidaMaxima, personaje.vida + this.valor)
        const vidaCurada = personaje.vida - vidaAnterior
        return {
          exito: true,
          mensaje: `${personaje.nombre} usa ${this.nombre} y recupera ${vidaCurada} puntos de vida`,
          valor: vidaCurada,
        }

      case "mana":
        const manaAnterior = personaje.mana
        personaje.mana = Math.min(personaje.manaMaximo, personaje.mana + this.valor)
        const manaRecuperado = personaje.mana - manaAnterior
        return {
          exito: true,
          mensaje: `${personaje.nombre} usa ${this.nombre} y recupera ${manaRecuperado} puntos de mana`,
          valor: manaRecuperado,
        }

      case "ataque_temporal":
        return {
          exito: true,
          mensaje: `${personaje.nombre} usa ${this.nombre} y aumenta su ataque temporalmente`,
          efecto: "ataque_aumentado",
          duracion: 3,
          valor: this.valor,
        }

      case "defensa_temporal":
        return {
          exito: true,
          mensaje: `${personaje.nombre} usa ${this.nombre} y aumenta su defensa temporalmente`,
          efecto: "defensa_aumentada",
          duracion: 3,
          valor: this.valor,
        }

      default:
        return {
          exito: false,
          mensaje: `No se puede usar ${this.nombre}`,
        }
    }
  }
}

class GeneradorItems {
  static crearItemsBasicos() {
    return [
      new Item("Poción de Vida", "consumible", "curar", 50, "Restaura 50 puntos de vida"),
      new Item("Poción de Vida Mayor", "consumible", "curar", 100, "Restaura 100 puntos de vida"),
      new Item("Poción de Mana", "consumible", "mana", 30, "Restaura 30 puntos de mana"),
      new Item("Poción de Mana Mayor", "consumible", "mana", 60, "Restaura 60 puntos de mana"),
      new Item("Elixir de Fuerza", "consumible", "ataque_temporal", 10, "Aumenta el ataque por 3 turnos"),
      new Item("Poción de Resistencia", "consumible", "defensa_temporal", 8, "Aumenta la defensa por 3 turnos"),
    ]
  }

  static obtenerItemAleatorio() {
    const items = this.crearItemsBasicos()
    return items[Math.floor(Math.random() * items.length)]
  }
}

module.exports = { Item, GeneradorItems }
