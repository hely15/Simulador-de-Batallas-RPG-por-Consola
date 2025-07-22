const { v4: uuidv4 } = require("uuid")

class personaje {
  #id
  #nombre
  #nivel
  #vida
  #vidaMaxima
  #mana
  #manaMaximo
  #ataque
  #defensa
  #velocidad

  constructor(nombre, clase) {
    if (this.constructor === personaje) {
      throw new Error("No se puede instanciar la clase personaje")
    }

    this.#id = uuidv4()
    this.#nombre = nombre
    this.#nivel = 1
    this.clase = clase
    this.experiencia = 0
    this.experienciaNecesaria = 100
    this.#vida = 100
    this.#vidaMaxima = 100
    this.#mana = 50
    this.#manaMaximo = 50
    this.#ataque = 20
    this.#defensa = 10
    this.#velocidad = 10
  }

  get id() {
    return this.#id
  }
  get nombre() {
    return this.#nombre
  }
  get nivel() {
    return this.#nivel
  }
  get vida() {
    return this.#vida
  }
  get vidaMaxima() {
    return this.#vidaMaxima
  }
  get mana() {
    return this.#mana
  }
  get manaMaximo() {
    return this.#manaMaximo
  }
  get ataque() {
    return this.#ataque
  }
  get defensa() {
    return this.#defensa
  }
  get velocidad() {
    return this.#velocidad
  }

  set nivel(valor) {
    this.#nivel = Math.max(1, valor)
  }
  set vida(valor) {
    this.#vida = Math.max(0, Math.min(valor, this.#vidaMaxima))
  }
  set mana(valor) {
    this.#mana = Math.max(0, Math.min(valor, this.#manaMaximo))
  }
  set ataque(valor) {
    this.#ataque = Math.max(0, valor)
  }
  set defensa(valor) {
    this.#defensa = Math.max(0, valor)
  }
  set velocidad(valor) {
    this.#velocidad = Math.max(0, valor)
  }
  set vidaMaxima(valor) {
    this.#vidaMaxima = Math.max(1, valor)
  }
  set manaMaximo(valor) {
    this.#manaMaximo = Math.max(0, valor)
  }

  _establecerEstadisticas(vida, mana, ataque, defensa, velocidad) {
    this.vidaMaxima = vida
    this.vida = vida
    this.manaMaximo = mana
    this.mana = mana
    this.ataque = ataque
    this.defensa = defensa
    this.velocidad = velocidad
  }

  subirNivel() {
    this.#nivel++
    this.experiencia = 0
    this.experienciaNecesaria = Math.floor(this.experienciaNecesaria * 1.5)
    this._mejorarEstadisticas()
  }


  _mejorarEstadisticas() {
    throw new Error("Las clases hijas deben implementar _mejorarEstadisticas")
  }

  obtenerHabilidades() {
    throw new Error("Las clases hijas deben implementar obtenerHabilidades")
  }

  obtenerInformacion() {
    return {
      id: this.#id,
      nombre: this.#nombre,
      clase: this.clase,
      nivel: this.#nivel,
      vida: `${this.#vida}/${this.#vidaMaxima}`,
      mana: `${this.#mana}/${this.#manaMaximo}`,
      ataque: this.#ataque,
      defensa: this.#defensa,
      velocidad: this.#velocidad,
      experiencia: `${this.experiencia}/${this.experienciaNecesaria}`,
    }
  }

  asignarInventario(inventario) {
    this.inventario = inventario
  }

  estaVivo() {
    return this.#vida > 0
  }
}

module.exports = { personaje }
