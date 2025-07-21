const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const file = path.join(__dirname, '../../data/personajes.json');
const adapter = new FileSync(file);
const db = low(adapter);

// Inicializa la base de datos
function inicializarDB() {
  db.defaults({ personajes: [] }).write();
}

// Guarda un personaje
function guardarPersonaje(personaje) {
  inicializarDB();
  const info = personaje.obtenerInformacion(); // Método público
  db.get('personajes').push(info).write();
  console.log(`Personaje ${info.nombre} guardado exitosamente.`);
}

// Carga todos los personajes
function cargarPersonajes() {
  inicializarDB();
  return db.get('personajes').value();
}

module.exports = {
  guardarPersonaje,
  cargarPersonajes
};
