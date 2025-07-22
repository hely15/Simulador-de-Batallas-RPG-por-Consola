const { GestorPersonajes } = require("./src/services/gestorPersonajes")
const { GestorBatallas } = require("./src/services/gestorBatallas")
const { NotificadorConsola } = require("./src/services/notificador")
const inquirer = require("inquirer").default

class JuegoRPG {
  constructor() {
    this.notificador = new NotificadorConsola()
    this.gestorPersonajes = new GestorPersonajes(this.notificador)
    this.gestorBatallas = new GestorBatallas(this.notificador)
  }

  async iniciar() {
    console.clear()
    this.notificador.mostrarTitulo("SIMULADOR DE BATALLAS RPG")
    this.notificador.notificar("¡Bienvenido al mundo de las aventuras!", "exito")

    while (true) {
      const { accion } = await inquirer.prompt([
        {
          type: "list",
          name: "accion",
          message: "¿Qué deseas hacer?",
          choices: ["Crear nuevo personaje", "Cargar personaje existente", "Salir del juego"],
        },
      ])

      if (accion === "Salir del juego") {
        this.notificador.notificar("¡Gracias por jugar! ¡Hasta la próxima!", "info")
        process.exit(0)
      }

      let jugador

      if (accion === "Crear nuevo personaje") {
        jugador = await this.gestorPersonajes.crearPersonaje()
      } else {
        jugador = await this.gestorPersonajes.cargarPersonaje()
        if (!jugador) {
          this.notificador.notificar("Regresando al menú principal...", "info")
          continue
        }
      }

      await this.menuJugador(jugador)
    }
  }

  async menuJugador(jugador) {
    while (true) {
      const { opcion } = await inquirer.prompt([
        {
          type: "list",
          name: "opcion",
          message: `¿Qué deseas hacer con ${jugador.nombre}?`,
          choices: ["Iniciar batalla", "Ver estadísticas", "Ver inventario", "Volver al menú principal"],
        },
      ])

      switch (opcion) {
        case "Ver estadísticas":
          this.gestorPersonajes.mostrarEstadisticas(jugador)
          await this.pausa()
          break

        case "Ver inventario":
          await this.mostrarInventarioCompleto(jugador)
          break

        case "Iniciar batalla":
          await this.gestorBatallas.iniciarBatalla(jugador)

          const { guardarPersonaje } = require("./src/services/db.js")
          await guardarPersonaje(jugador)
          this.notificador.notificar("Progreso guardado", "exito")

          await this.pausa()
          break

        case "Volver al menú principal":
          return
      }
    }
  }

  async mostrarInventarioCompleto(jugador) {
    if (!jugador.inventario || !jugador.inventario.tieneItems()) {
      this.notificador.notificar("Tu inventario está vacío", "advertencia")
      return
    }

    const items = jugador.inventario.obtenerItemsDisponibles()

    this.notificador.mostrarTitulo(`Inventario de ${jugador.nombre}`)
    items.forEach((item) => {
      console.log(`• ${item.nombre} x${item.cantidad} - ${item.descripcion}`)
    })

    await this.pausa()
  }

  async pausa() {
    await inquirer.prompt([
      {
        type: "input",
        name: "continuar",
        message: "Presiona Enter para continuar...",
      },
    ])
  }
}

async function main() {
  const juego = new JuegoRPG()
  await juego.iniciar()
}

process.on("unhandledRejection", (error) => {
  console.error("Error no manejado:", error)
  process.exit(1)
})

main().catch(console.error)
