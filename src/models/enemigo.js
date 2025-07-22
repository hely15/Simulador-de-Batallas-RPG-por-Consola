const { personaje } = require("./personaje")
const { IAtacante } = require("../interfaces/interfaces")

class Enemigo extends personaje {
  constructor(nombre = "Enemigo Salvaje", nivel = 1) {
    super(nombre, "Enemigo")
    this.nivel = nivel
    this.tipo = "enemigo"
    this.experiencia = 0
    this.experienciaNecesaria = 100
    this.generarStats()
    this.generarHabilidadesEspeciales()
  }

  generarStats() {
    // Estadísticas escaladas por nivel
    const baseVida = 50 + this.nivel * 15
    const baseMana = 20 + this.nivel * 8
    const baseAtaque = 10 + this.nivel * 3
    const baseDefensa = 5 + this.nivel * 2
    const baseVelocidad = 5 + this.nivel

    this._establecerEstadisticas(baseVida, baseMana, baseAtaque, baseDefensa, baseVelocidad)
  }

  generarHabilidadesEspeciales() {
    const habilidadesPorNivel = [
      ["Ataque Básico", "Rugido"],
      ["Ataque Básico", "Rugido", "Golpe Salvaje"],
      ["Ataque Básico", "Rugido", "Golpe Salvaje", "Furia"],
      ["Ataque Básico", "Rugido", "Golpe Salvaje", "Furia", "Regeneración"],
    ]

    const indice = Math.min(this.nivel - 1, habilidadesPorNivel.length - 1)
    this.habilidadesEspeciales = habilidadesPorNivel[indice]
  }

  // Implementación de métodos abstractos
  _mejorarEstadisticas() {
    this.generarStats()
  }

  obtenerHabilidades() {
    return this.habilidadesEspeciales
  }

  // IA mejorada para elegir habilidades
  elegirHabilidad() {
    const habilidades = this.obtenerHabilidades()

    // IA simple: más probabilidad de usar habilidades especiales en niveles altos
    if (this.nivel >= 3 && Math.random() < 0.4) {
      return habilidades[habilidades.length - 1] // Habilidad más poderosa
    } else if (this.nivel >= 2 && Math.random() < 0.3) {
      return habilidades[Math.floor(habilidades.length / 2)] // Habilidad intermedia
    }

    return habilidades[0] // Ataque básico
  }

  // Habilidades específicas del enemigo
  rugido(objetivo) {
    return {
      exito: true,
      mensaje: `${this.nombre} ruge intimidantemente`,
      efecto: "intimidado",
      duracion: 2,
      danio: 0,
    }
  }

  golpeSalvaje(objetivo) {
    const danio = Math.floor(this.ataque * 1.5)
    return {
      exito: true,
      mensaje: `${this.nombre} ejecuta un golpe salvaje`,
      danio: danio,
    }
  }

  furia() {
    return {
      exito: true,
      mensaje: `${this.nombre} entra en furia`,
      efecto: "furia",
      duracion: 3,
    }
  }

  regeneracion() {
    const curacion = Math.floor(this.vidaMaxima * 0.2)
    this.vida = Math.min(this.vidaMaxima, this.vida + curacion)

    return {
      exito: true,
      mensaje: `${this.nombre} se regenera`,
      curacion: curacion,
    }
  }

  obtenerInformacion() {
    const info = super.obtenerInformacion()
    return {
      ...info,
      tipo: this.tipo,
      habilidades: this.obtenerHabilidades(),
    }
  }
}

module.exports = { Enemigo }
