const GeneradorEnemigos = require("./generadorEnemigos");

function iniciarBatalla(jugador) {
    const enemigo = GeneradorEnemigos.generarAleatorio(jugador.nivel);
    console.log("comienza la batalla");
    console.log(`${jugador.nombre} VS ${enemigo.nombre}`);

    let turno = jugador.velocidad >= enemigo.velocidad ? "jugador" : "enemigo";

    while (jugador.estaVivo() && enemigo.estaVivo()) {
        if (turno === "jugador") {
            const daño = jugador.ataque - enemigo.defensa;
            enemigo.vida -= Math.max(1, daño);
            console.log(`${jugador.nombre} ataca a ${enemigo.nombre} y le causa ${Math.max(1, daño)} de daño`);
            turno = "enemigo";
        } else {
            const daño = enemigo.ataque - jugador.defensa;
            jugador.vida -= Math.max(1, daño);
            console.log(`${enemigo.nombre} ataca a ${jugador.nombre} y le causa ${Math.max(1, daño)} de daño`);
            turno = "jugador";
        }

        console.log("Resultados de la batalla:");
        console.log(`${jugador.nombre} : ${jugador.vida}/${jugador.vidaMaxima} HP`);
        console.log(`${enemigo.nombre} : ${enemigo.vida}/${enemigo.vidaMaxima} HP`);
    }

    if (jugador.estaVivo()) {
        console.log(`${jugador.nombre} ha ganado la batalla`);
    } else {
        console.log(`${enemigo.nombre} ha ganado la batalla a ${jugador.nombre}.`);
    }
}

module.exports = { iniciarBatalla };
