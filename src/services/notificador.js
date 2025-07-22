const chalk = require("chalk")
const { INotificador } = require("../interfaces/interfaces")

class NotificadorConsola extends INotificador {
  notificar(mensaje, tipo = "info") {
    switch (tipo) {
      case "exito":
        console.log(chalk.green(` ${mensaje}`))
        break
      case "error":
        console.log(chalk.red(` ${mensaje}`))
        break
      case "advertencia":
        console.log(chalk.yellow(` ${mensaje}`))
        break
      case "info":
        console.log(chalk.blue(`ℹ️ ${mensaje}`))
        break
      case "batalla":
        console.log(chalk.magenta(` ${mensaje}`))
        break
      default:
        console.log(mensaje)
    }
  }

  mostrarTitulo(titulo) {
    console.log(chalk.cyan.bold(`\n${"=".repeat(50)}`))
    console.log(chalk.cyan.bold(`${titulo.toUpperCase()}`))
    console.log(chalk.cyan.bold(`${"=".repeat(50)}`))
  }

  mostrarSeparador() {
    console.log(chalk.gray("-".repeat(30)))
  }
}

module.exports = { NotificadorConsola }
