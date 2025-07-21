const {guardarPersonaje} = require("./src/services/db.js")
const inquirer = require('inquirer').default;
const {Mago} = require("./src/models/mago.js");
const {Guerrero} = require("./src/models/guerrero.js")
const {Arquero} = require("./src/models/arquero.js")
const {iniciarBatalla} = require("./src/services/gestorBatallas.js");

async function main() {
    console.clear();
    console.log("Bienvenido")

    const {nombre} = await inquirer.prompt([
        {
            type: "input",
            name: "nombre",
            message: "Ingresa tu nombre: ",
            validate: input => input.trim() !== "" || "El nombre no puede estar vacio"
        },
    ]);
    
    const {clase} = await  inquirer.prompt([
        {
            type: "list",
            name: "clase",
            message: "Eligue tu clase: ",
            choices: ["Mago" ,"Guerrero", "Arquero"]
        },
    ]);

    let jugador;

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

        console.log(`Has elegido ser un ${clase} llamado ${nombre}. ¡Prepárate para la batalla!`);

    await guardarPersonaje(jugador);
    console.log("¡Prepárate para la batalla!\n");

    iniciarBatalla(jugador);
    
    const {continuar} = await inquirer.prompt([
        {
            type: "confirm",
            name: "continuar",
            message: "Quieres jugar otra batalla?",
            default: false
        },
    ]);
    if (continuar){
        return main();
    } else{
        console.log("Gracias por jugar, hasta la proxima.");
        process.exit();
    }
}

main();