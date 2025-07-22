const { Enemigo } = require("../models/enemigo.js")

class GeneradorEnemigos {
  constructor() {
    this.tiposEnemigos = [
      { nombre: "Goblin", multiplicadorStats: 0.8 },
      { nombre: "Orco", multiplicadorStats: 1.0 },
      { nombre: "Esqueleto", multiplicadorStats: 0.9 },
      { nombre: "Bandido", multiplicadorStats: 1.1 },
      { nombre: "Troll", multiplicadorStats: 1.3 },
      { nombre: "Dragón Menor", multiplicadorStats: 1.5 },
    ]
  }

  generarAleatorio(nivelJugador = 1) {
    const nivelMin = Math.max(1, nivelJugador - 1)
    const nivelMax = nivelJugador + 1
    const nivelEnemigo = Math.floor(Math.random() * (nivelMax - nivelMin + 1)) + nivelMin
    const tipoEnemigo = this.tiposEnemigos[Math.floor(Math.random() * this.tiposEnemigos.length)]
    const enemigo = new Enemigo(tipoEnemigo.nombre, nivelEnemigo)

    this.aplicarMultiplicador(enemigo, tipoEnemigo.multiplicadorStats)
    return enemigo
  }

  generarJefe(nivelJugador) {
    const nivelJefe = nivelJugador + 2
    const jefe = new Enemigo("Jefe Supremo", nivelJefe)
    this.aplicarMultiplicador(jefe, 1.8)

    return jefe
  }

  aplicarMultiplicador(enemigo, multiplicador) {
    enemigo.vida = Math.floor(enemigo.vida * multiplicador)
    enemigo.vidaMaxima = Math.floor(enemigo.vidaMaxima * multiplicador)
    enemigo.ataque = Math.floor(enemigo.ataque * multiplicador)
    enemigo.defensa = Math.floor(enemigo.defensa * multiplicador)
  }

  generarGrupo(nivelJugador, cantidad = 2) {
    const grupo = []
    for (let i = 0; i < cantidad; i++) {
      grupo.push(this.generarAleatorio(nivelJugador))
    }
    return grupo
  }
}

module.exports = { GeneradorEnemigos }
