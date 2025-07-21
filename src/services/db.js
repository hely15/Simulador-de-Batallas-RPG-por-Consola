const {Low} = require("lowdb");
const {JSONFile} = require("lowdb/node")
const path = require("path");


const file = path.join(__dirname, '../../data/personajes.json');
const adapter = new JSONFile(file);
const db = new Low (adapter);

async function inicializarDB() {
    await db.read();
    db.data ||= {personajes: []};
    await db.write();
}

async function guardarPersonaje(personaje) {
    await inicializarDB();
    db.data.personajes.push(personaje);
    await db.write();
    console.log(`Personaje ${personaje.nombre} guardado exitosamente.`);
}

async function cargarPersonajes() {
    await inicializarDB();
    return db.data.personajes;
}

module.exports = {
  guardarPersonaje,
  cargarPersonajes
};