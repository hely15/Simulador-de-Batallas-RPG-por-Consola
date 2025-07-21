const { Enemigo } = require("../models/enemigo.js");

class GeneradorEnemigos {
  static generarAleatorio(nivel = 1) {
    const nombres = ['Orco', 'Goblin', 'Esqueleto', 'Bandido'];
    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    return new Enemigo(nombre, nivel);
  }
}

module.exports = GeneradorEnemigos;
