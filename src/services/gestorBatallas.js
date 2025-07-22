const GeneradorEnemigos = require("./generadorEnemigos")
const inquirer = require("inquirer").default
const chalk = require("chalk")

class GestorBatallas {
  constructor() {
    this.efectosActivos = new Map()
  }

  async iniciarBatalla(jugador) {
    const enemigo = GeneradorEnemigos.generarAleatorio(jugador.nivel)

    console.clear()
    console.log(chalk.red.bold("⚔️  ¡COMIENZA LA BATALLA! ⚔️"))
    console.log(
      chalk.blue(`${jugador.nombre} (${jugador.clase})`) + chalk.white(" VS ") + chalk.red(`${enemigo.nombre}`),
    )
    console.log("═".repeat(50))

    // Determinar quién va primero
    let turnoJugador = jugador.velocidad >= enemigo.velocidad
    let turno = 1

    while (jugador.estaVivo() && enemigo.estaVivo()) {
      console.log(chalk.yellow(`\n--- TURNO ${turno} ---`))
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

    this.mostrarResultadoBatalla(jugador, enemigo)
  }

  async turnoJugador(jugador, enemigo) {
    console.log(chalk.cyan(`\n🎯 Turno de ${jugador.nombre}`))

    const opciones = ["Ataque básico", "Usar habilidad especial", "Defenderse"]

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
      case "Defenderse":
        resultado = this.defenderse(jugador)
        break
    }

    if (resultado) {
      console.log(chalk.green(`💥 ${resultado.mensaje}`))
      if (resultado.danio) {
        console.log(chalk.red(`   Daño causado: ${resultado.danio}`))
      }
      if (resultado.efecto) {
        this.aplicarEfecto(enemigo, resultado.efecto, resultado.duracion || 1)
      }
    }
  }

  async turnoEnemigo(enemigo, jugador) {
    console.log(chalk.red(`\n👹 Turno de ${enemigo.nombre}`))

    // IA simple del enemigo
    const accionAleatoria = Math.random()
    let resultado

    if (accionAleatoria < 0.7) {
      resultado = this.ataqueBasico(enemigo, jugador)
    } else {
      resultado = this.ataqueEspecialEnemigo(enemigo, jugador)
    }

    if (resultado) {
      console.log(chalk.red(`💥 ${resultado.mensaje}`))
      if (resultado.danio) {
        console.log(chalk.yellow(`   Daño recibido: ${resultado.danio}`))
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1500))
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
          objetivo.vida -= golpe.danio
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
        return { mensaje: `${guerrero.nombre} levanta su escudo defensivo!` }

      default:
        return this.ataqueBasico(guerrero, objetivo)
    }
  }

  habilidadesMago(mago, objetivo, habilidad) {
    switch (habilidad) {
      case "Bola de Fuego":
        const bola = mago.bolaDeFuego(objetivo)
        if (bola.exito) {
          objetivo.vida -= bola.danio
          return { mensaje: bola.mensaje, danio: bola.danio }
        }
        return { mensaje: bola.mensaje }

      case "Curación":
        const curacion = mago.curacion()
        if (curacion.exito) {
          return { mensaje: `${curacion.mensaje} Vida restaurada: ${curacion.curacion}` }
        }
        return { mensaje: curacion.mensaje }

      case "Rayo de Hielo":
        const rayo = mago.rayoDeHielo(objetivo)
        if (rayo.exito) {
          objetivo.vida -= rayo.danio
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
          objetivo.vida -= disparo.danio
          return { mensaje: disparo.mensaje, danio: disparo.danio }
        }
        return { mensaje: disparo.mensaje }

      case "Lluvia de Flechas":
        const lluvia = arquero.lluviaDeFlechas([objetivo])
        if (lluvia.exito) {
          objetivo.vida -= lluvia.danio
          return { mensaje: lluvia.mensaje, danio: lluvia.danio }
        }
        return { mensaje: lluvia.mensaje }

      case "Trampa de Fuego":
        const trampa = arquero.tiroExplosivo(objetivo)
        if (trampa.exito) {
          objetivo.vida -= trampa.danio
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

    objetivo.vida -= danio

    return {
      mensaje: `${atacante.nombre} ataca a ${objetivo.nombre}`,
      danio: danio,
    }
  }

  ataqueEspecialEnemigo(enemigo, jugador) {
    const ataques = ["Golpe Salvaje", "Rugido Intimidante", "Ataque Frenético"]

    const ataque = ataques[Math.floor(Math.random() * ataques.length)]
    let danio = Math.max(1, enemigo.ataque - jugador.defensa)

    switch (ataque) {
      case "Golpe Salvaje":
        danio = Math.floor(danio * 1.5)
        break
      case "Rugido Intimidante":
        this.aplicarEfecto(jugador, "intimidado", 2)
        danio = Math.floor(danio * 0.8)
        break
      case "Ataque Frenético":
        danio = Math.floor(danio * 1.2)
        break
    }

    jugador.vida -= danio

    return {
      mensaje: `${enemigo.nombre} usa ${ataque}`,
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

    console.log(chalk.magenta(`✨ ${personaje.nombre} está afectado por: ${efecto}`))
  }

  procesarEfectos(personaje) {
    const efectosPersonaje = Array.from(this.efectosActivos.entries()).filter(
      ([key, data]) => data.personaje === personaje,
    )

    efectosPersonaje.forEach(([key, data]) => {
      switch (data.efecto) {
        case "ataque_aumentado":
          // El efecto ya está aplicado en las habilidades
          break
        case "congelado":
          console.log(chalk.blue(`❄️ ${personaje.nombre} está congelado y pierde el turno`))
          break
        case "escudo_defensivo":
          console.log(chalk.cyan(`🛡️ ${personaje.nombre} tiene defensa aumentada`))
          break
        case "intimidado":
          console.log(chalk.gray(`😰 ${personaje.nombre} está intimidado`))
          break
      }

      data.turnosRestantes--
      if (data.turnosRestantes <= 0) {
        this.efectosActivos.delete(key)
        console.log(chalk.yellow(`⏰ El efecto ${data.efecto} de ${personaje.nombre} ha terminado`))
      }
    })
  }

  mostrarEstadoBatalla(jugador, enemigo) {
    console.log("\n" + "═".repeat(50))

    // Estado del jugador
    const vidaJugadorPorcentaje = (jugador.vida / jugador.vidaMaxima) * 100
    const barraVidaJugador = this.crearBarraVida(vidaJugadorPorcentaje)

    console.log(chalk.blue.bold(`👤 ${jugador.nombre} (${jugador.clase})`))
    console.log(`   ❤️  Vida: ${barraVidaJugador} ${jugador.vida}/${jugador.vidaMaxima}`)
    console.log(`   💙 Mana: ${jugador.mana}/${jugador.manaMaximo}`)

    // Estado del enemigo
    const vidaEnemigoPorcentaje = (enemigo.vida / enemigo.vidaMaxima) * 100
    const barraVidaEnemigo = this.crearBarraVida(vidaEnemigoPorcentaje)

    console.log(chalk.red.bold(`\n👹 ${enemigo.nombre}`))
    console.log(`   ❤️  Vida: ${barraVidaEnemigo} ${enemigo.vida}/${enemigo.vidaMaxima}`)

    console.log("═".repeat(50))
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

  mostrarResultadoBatalla(jugador, enemigo) {
    console.log("\n" + "═".repeat(50))

    if (jugador.estaVivo()) {
      console.log(chalk.green.bold("🎉 ¡VICTORIA! 🎉"))
      console.log(chalk.green(`${jugador.nombre} ha derrotado a ${enemigo.nombre}!`))

      // Otorgar experiencia
      const expGanada = enemigo.nivel * 25
      jugador.experiencia += expGanada
      console.log(chalk.cyan(`💫 Has ganado ${expGanada} puntos de experiencia!`))

      // Verificar subida de nivel
      if (jugador.experiencia >= jugador.experienciaNecesaria) {
        console.log(chalk.yellow.bold("🌟 ¡HAS SUBIDO DE NIVEL! 🌟"))
        jugador.subirNivel()
        console.log(chalk.yellow(`Ahora eres nivel ${jugador.nivel}!`))
      }
    } else {
      console.log(chalk.red.bold("💀 DERROTA 💀"))
      console.log(chalk.red(`${enemigo.nombre} ha derrotado a ${jugador.nombre}...`))
      console.log(chalk.gray("¡No te rindas! Inténtalo de nuevo."))
    }

    console.log("═".repeat(50))
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
