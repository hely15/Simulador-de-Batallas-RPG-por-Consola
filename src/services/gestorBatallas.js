const { GeneradorEnemigos } = require("./generadorEnemigos")
const { GestorInventario } = require("./gestorInventario")
const { NotificadorConsola } = require("./notificador")
const inquirer = require("inquirer").default
const chalk = require("chalk")

class GestorBatallas {
  constructor(notificador = new NotificadorConsola(), gestorInventario = new GestorInventario()) {
    this.notificador = notificador
    this.gestorInventario = gestorInventario
    this.generadorEnemigos = new GeneradorEnemigos()
    this.efectosActivos = new Map()
  }

  async iniciarBatalla(jugador) {
    const enemigo = this.generadorEnemigos.generarAleatorio(jugador.nivel)

    console.clear()
    this.notificador.mostrarTitulo("COMIENZA LA BATALLA")
    this.notificador.notificar(`${jugador.nombre} (${jugador.clase}) VS ${enemigo.nombre}`, "batalla")

    // Determinar quién va primero
    let turnoJugador = jugador.velocidad >= enemigo.velocidad
    let turno = 1

    while (jugador.estaVivo() && enemigo.estaVivo()) {
      this.notificador.notificar(`--- TURNO ${turno} ---`, "info")
      this.mostrarEstadoBatalla(jugador, enemigo)

      if (turnoJugador) {
        await this.turnoJugador(jugador, enemigo)
      } else {
        await this.turnoEnemigo(enemigo, jugador)
      }

      // Procesar efectos de estado
      this.procesarEfectos(jugador)
      this.procesarEfectos(enemigo)

      turnoJugador = !turnoJugador
      turno++

      // Pausa para que el usuario pueda leer
      if (jugador.estaVivo() && enemigo.estaVivo()) {
        await this.pausa()
      }
    }

    await this.mostrarResultadoBatalla(jugador, enemigo)
  }

  async turnoJugador(jugador, enemigo) {
    this.notificador.notificar(`Turno de ${jugador.nombre}`, "info")

    const opciones = ["Ataque básico", "Usar habilidad especial", "Usar item del inventario", "Defenderse"]

    const { accion } = await inquirer.prompt([
      {
        type: "list",
        name: "accion",
        message: "¿Qué deseas hacer?",
        choices: opciones,
      },
    ])

    let resultado

    switch (accion) {
      case "Ataque básico":
        resultado = this.ataqueBasico(jugador, enemigo)
        break
      case "Usar habilidad especial":
        resultado = await this.usarHabilidadEspecial(jugador, enemigo)
        break
      case "Usar item del inventario":
        resultado = await this.gestorInventario.mostrarInventario(jugador)
        if (!resultado) {
          resultado = this.ataqueBasico(jugador, enemigo)
        }
        break
      case "Defenderse":
        resultado = this.defenderse(jugador)
        break
    }

    this.procesarResultadoAccion(resultado, enemigo)
  }

  async turnoEnemigo(enemigo, jugador) {
    this.notificador.notificar(`Turno de ${enemigo.nombre}`, "batalla")

    const habilidadElegida = enemigo.elegirHabilidad()
    let resultado

    switch (habilidadElegida) {
      case "Rugido":
        resultado = enemigo.rugido(jugador)
        break
      case "Golpe Salvaje":
        resultado = enemigo.golpeSalvaje(jugador)
        break
      case "Furia":
        resultado = enemigo.furia()
        break
      case "Regeneración":
        resultado = enemigo.regeneracion()
        break
      default:
        resultado = this.ataqueBasico(enemigo, jugador)
    }

    this.procesarResultadoAccion(resultado, jugador)
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  procesarResultadoAccion(resultado, objetivo) {
    if (!resultado) return
    this.notificador.notificar(resultado.mensaje, "batalla")
    if (resultado.danio && objetivo) {
      objetivo.vida -= resultado.danio
      this.notificador.notificar(`Daño causado: ${resultado.danio}`, "advertencia")
    }
    if (resultado.curacion) {
      this.notificador.notificar(`Curación: ${resultado.curacion}`, "exito")
    }
    if (resultado.efecto && objetivo) {
      this.aplicarEfecto(objetivo, resultado.efecto, resultado.duracion || 1)
    }
  }

  async usarHabilidadEspecial(jugador, enemigo) {
    const habilidades = jugador.obtenerHabilidades()

    const { habilidad } = await inquirer.prompt([
      {
        type: "list",
        name: "habilidad",
        message: "¿Qué habilidad deseas usar?",
        choices: [...habilidades, "Cancelar"],
      },
    ])

    if (habilidad === "Cancelar") {
      return this.ataqueBasico(jugador, enemigo)
    }

    return this.ejecutarHabilidad(jugador, enemigo, habilidad)
  }

  ejecutarHabilidad(atacante, objetivo, habilidad) {
    switch (atacante.clase) {
      case "Guerrero":
        return this.habilidadesGuerrero(atacante, objetivo, habilidad)
      case "Mago":
        return this.habilidadesMago(atacante, objetivo, habilidad)
      case "Arquero":
        return this.habilidadesArquero(atacante, objetivo, habilidad)
      default:
        return this.ataqueBasico(atacante, objetivo)
    }
  }

  habilidadesGuerrero(guerrero, objetivo, habilidad) {
    switch (habilidad) {
      case "Golpe Devastador":
        const golpe = guerrero.golpeDevastador(objetivo)
        if (golpe.exito) {
          return { mensaje: golpe.mensaje, danio: golpe.danio }
        }
        return { mensaje: golpe.mensaje }

      case "Berseker":
        const berserker = guerrero.berserker()
        if (berserker.exito) {
          this.aplicarEfecto(guerrero, berserker.efecto, berserker.duracion)
          return { mensaje: berserker.mensaje }
        }
        return { mensaje: berserker.mensaje }

      case "Escudo Defensivo":
        this.aplicarEfecto(guerrero, "escudo_defensivo", 3)
        return { mensaje: `${guerrero.nombre} levanta su escudo defensivo` }

      default:
        return this.ataqueBasico(guerrero, objetivo)
    }
  }

  habilidadesMago(mago, objetivo, habilidad) {
    switch (habilidad) {
      case "Bola de Fuego":
        const bola = mago.bolaDeFuego(objetivo)
        if (bola.exito) {
          return { mensaje: bola.mensaje, danio: bola.danio }
        }
        return { mensaje: bola.mensaje }

      case "Curación":
        const curacion = mago.curacion()
        if (curacion.exito) {
          return { mensaje: curacion.mensaje, curacion: curacion.curacion }
        }
        return { mensaje: curacion.mensaje }

      case "Rayo de Hielo":
        const rayo = mago.rayoDeHielo(objetivo)
        if (rayo.exito) {
          return {
            mensaje: rayo.mensaje,
            danio: rayo.danio,
            efecto: rayo.efecto,
            duracion: rayo.duracion,
          }
        }
        return { mensaje: rayo.mensaje }

      default:
        return this.ataqueBasico(mago, objetivo)
    }
  }

  habilidadesArquero(arquero, objetivo, habilidad) {
    switch (habilidad) {
      case "Disparo Certero":
        const disparo = arquero.disparoCertero(objetivo)
        if (disparo.exito) {
          return { mensaje: disparo.mensaje, danio: disparo.danio }
        }
        return { mensaje: disparo.mensaje }

      case "Lluvia de Flechas":
        const lluvia = arquero.lluviaDeFlechas([objetivo])
        if (lluvia.exito) {
          return { mensaje: lluvia.mensaje, danio: lluvia.danio }
        }
        return { mensaje: lluvia.mensaje }

      case "Trampa de Fuego":
        const trampa = arquero.tiroExplosivo(objetivo)
        if (trampa.exito) {
          return {
            mensaje: trampa.mensaje,
            danio: trampa.danio,
            efecto: trampa.efecto,
            duracion: trampa.duracion,
          }
        }
        return { mensaje: trampa.mensaje }

      default:
        return this.ataqueBasico(arquero, objetivo)
    }
  }

  ataqueBasico(atacante, objetivo) {
    const danioBase = Math.max(1, atacante.ataque - objetivo.defensa)
    const danio = Math.floor(danioBase + Math.random() * 5)

    return {
      mensaje: `${atacante.nombre} ataca a ${objetivo.nombre}`,
      danio: danio,
    }
  }

  defenderse(personaje) {
    this.aplicarEfecto(personaje, "defendiendo", 1)
    return { mensaje: `${personaje.nombre} se defiende y reduce el daño del próximo ataque` }
  }

  aplicarEfecto(personaje, efecto, duracion) {
    const key = `${personaje.id || personaje.nombre}_${efecto}`
    this.efectosActivos.set(key, {
      personaje: personaje,
      efecto: efecto,
      duracion: duracion,
      turnosRestantes: duracion,
    })

    this.notificador.notificar(`${personaje.nombre} está afectado por: ${efecto}`, "advertencia")
  }

  procesarEfectos(personaje) {
    const efectosPersonaje = Array.from(this.efectosActivos.entries()).filter(
      ([key, data]) => data.personaje === personaje,
    )

    efectosPersonaje.forEach(([key, data]) => {
      switch (data.efecto) {
        case "ataque_aumentado":
          this.notificador.notificar(`${personaje.nombre} tiene ataque aumentado`, "info")
          break
        case "congelado":
          this.notificador.notificar(`${personaje.nombre} está congelado`, "advertencia")
          break
        case "escudo_defensivo":
          this.notificador.notificar(`${personaje.nombre} tiene defensa aumentada`, "info")
          break
        case "intimidado":
          this.notificador.notificar(`${personaje.nombre} está intimidado`, "advertencia")
          break
        case "furia":
          this.notificador.notificar(`${personaje.nombre} está en furia`, "batalla")
          break
      }

      data.turnosRestantes--
      if (data.turnosRestantes <= 0) {
        this.efectosActivos.delete(key)
        this.notificador.notificar(`El efecto ${data.efecto} de ${personaje.nombre} ha terminado`, "info")
      }
    })
  }

  mostrarEstadoBatalla(jugador, enemigo) {
    this.notificador.mostrarSeparador()

    // Estado del jugador
    const vidaJugadorPorcentaje = (jugador.vida / jugador.vidaMaxima) * 100
    const barraVidaJugador = this.crearBarraVida(vidaJugadorPorcentaje)

    console.log(chalk.blue.bold(`👤 ${jugador.nombre} (${jugador.clase})`))
    console.log(`   ❤️  Vida: ${barraVidaJugador} ${jugador.vida}/${jugador.vidaMaxima}`)
    console.log(`   💙 Mana: ${jugador.mana}/${jugador.manaMaximo}`)

    // Estado del enemigo
    const vidaEnemigoPorcentaje = (enemigo.vida / enemigo.vidaMaxima) * 100
    const barraVidaEnemigo = this.crearBarraVida(vidaEnemigoPorcentaje)

    console.log(chalk.red.bold(`\n ${enemigo.nombre} (Nivel ${enemigo.nivel})`))
    console.log(`   ❤️  Vida: ${barraVidaEnemigo} ${enemigo.vida}/${enemigo.vidaMaxima}`)

    this.notificador.mostrarSeparador()
  }

  crearBarraVida(porcentaje) {
    const longitud = 20
    const lleno = Math.floor((porcentaje / 100) * longitud)
    const vacio = longitud - lleno

    let color = chalk.green
    if (porcentaje < 30) color = chalk.red
    else if (porcentaje < 60) color = chalk.yellow

    return color("█".repeat(lleno)) + chalk.gray("░".repeat(vacio))
  }

  async mostrarResultadoBatalla(jugador, enemigo) {
    this.notificador.mostrarSeparador()

    if (jugador.estaVivo()) {
      this.notificador.notificar("¡VICTORIA!", "exito")
      this.notificador.notificar(`${jugador.nombre} ha derrotado a ${enemigo.nombre}!`, "exito")
      const expGanada = enemigo.nivel * 25
      jugador.experiencia += expGanada
      this.notificador.notificar(`Has ganado ${expGanada} puntos de experiencia!`, "info")
      if (jugador.experiencia >= jugador.experienciaNecesaria) {
        this.notificador.notificar("¡HAS SUBIDO DE NIVEL!", "exito")
        jugador.subirNivel()
        this.notificador.notificar(`Ahora eres nivel ${jugador.nivel}!`, "exito")
      }
      if (Math.random() < 0.6) {
        this.gestorInventario.agregarItemAleatorio(jugador)
      }
    } else {
      this.notificador.notificar("DERROTA", "error")
      this.notificador.notificar(`${enemigo.nombre} ha derrotado a ${jugador.nombre}...`, "error")
      this.notificador.notificar("¡No te rindas! Inténtalo de nuevo.", "info")
    }

    this.notificador.mostrarSeparador()
  }

  async pausa() {
    await inquirer.prompt([
      {
        type: "input",
        name: "continuar",
        message: chalk.gray("Presiona Enter para continuar..."),
      },
    ])
  }
}

// Función de compatibilidad con el código existente
async function iniciarBatalla(jugador) {
  const gestor = new GestorBatallas()
  await gestor.iniciarBatalla(jugador)
}

module.exports = { iniciarBatalla, GestorBatallas }
