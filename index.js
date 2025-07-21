const { guardarPersonaje, cargarPersonajes } = require("./src/services/db.js");
const inquirer = require('inquirer').default;
const { Mago } = require("./src/models/mago.js");
const { Guerrero } = require("./src/models/guerrero.js");
const { Arquero } = require("./src/models/arquero.js");
const { iniciarBatalla } = require("./src/services/gestorBatallas.js");

async function main() {
    console.clear();
    console.log("Bienvenido");

    const { accion } = await inquirer.prompt([
        {
            type: "list",
            name: "accion",
            message: "¿Qué deseas hacer?",
            choices: ["Crear nuevo personaje", "Cargar personaje existente"]
        }
    ]);

    let jugador;

    if (accion === "Crear nuevo personaje") {
        const { nombre } = await inquirer.prompt([
            {
                type: "input",
                name: "nombre",
                message: "Ingresa tu nombre:",
                validate: input => input.trim() !== "" || "El nombre no puede estar vacío"
            }
        ]);

        const { clase } = await inquirer.prompt([
            {
                type: "list",
                name: "clase",
                message: "Elige tu clase:",
                choices: ["Mago", "Guerrero", "Arquero"]
            }
        ]);

        switch (clase) {
            case "Mago":
                jugador = new Mago(nombre);
                break;
            case "Guerrero":
                jugador = new Guerrero(nombre);
                break;
            case "Arquero":
                jugador = new Arquero(nombre);
                break;
        }

        await guardarPersonaje(jugador);
        console.log(`Personaje ${nombre} creado como ${clase} y guardado.`);
    } else {
        const personajes = await cargarPersonajes();

        if (personajes.length === 0) {
            console.log("No hay personajes guardados. Crea uno primero.");
            return main();
        }

        const { seleccionado } = await inquirer.prompt([
            {
                type: "list",
                name: "seleccionado",
                message: "Elige tu personaje:",
                choices: personajes.map(p => `${p.nombre} - ${p.clase}`)
            }
        ]);

        const [nombreSeleccionado] = seleccionado.split(" - ");
        const personajeData = personajes.find(p => p.nombre === nombreSeleccionado);

        // Reconstruye la instancia
        switch (personajeData.clase) {
            case "Mago":
                jugador = new Mago(personajeData.nombre);
                jugador.grimorio = personajeData.grimorio;
                break;
            case "Guerrero":
                jugador = new Guerrero(personajeData.nombre);
                break;
            case "Arquero":
                jugador = new Arquero(personajeData.nombre);
                break;
        }

        // Asigna atributos comunes
        jugador.vida = personajeData.vida;
        jugador.ataque = personajeData.ataque;
        jugador.defensa = personajeData.defensa;
        jugador.nivel = personajeData.nivel;
        jugador.experiencia = personajeData.experiencia;
        jugador.experienciaNecesaria = personajeData.experienciaNecesaria;
        jugador.habilidadesEspeciales = personajeData.habilidadesEspeciales;

        console.log(`✅ Personaje ${jugador.nombre} cargado con éxito.`);
    }

    const { opcion } = await inquirer.prompt([
        {
            type: "list",
            name: "opcion",
            message: "¿Qué deseas hacer?",
            choices: ["Iniciar batalla", "Ver estadísticas"]
        }
    ]);

    if (opcion === "Ver estadísticas") {
        console.log("\n Estadísticas del personaje:");
        console.log(jugador.obtenerInformacion());
    } else {
        await iniciarBatalla(jugador);
    }

    // Continuar o salir
    const { continuar } = await inquirer.prompt([
        {
            type: "confirm",
            name: "continuar",
            message: "¿Quieres volver al menú principal?",
            default: false
        }
    ]);

    if (continuar) {
        return main();
    } else {
        console.log("Gracias por jugar, ¡hasta la próxima!");
        process.exit();
    }
}

main();
