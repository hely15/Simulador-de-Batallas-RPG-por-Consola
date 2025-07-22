#  Simulador de Batallas RPG por Consola

Un juego de rol (RPG) por consola desarrollado en **Node.js**, donde puedes crear un personaje, enfrentarte a enemigos controlados por IA y guardar tu progreso localmente.

---

## Características

- Crear personajes personalizados de clases: `Mago`, `Guerrero` o `Arquero`.
- Guardar y cargar personajes desde una base de datos local (`lowdb`).
- Sistema de batallas por turnos contra enemigos con IA.
- Mostrar estadísticas y progreso del jugador.
- Guardado automático después de cada batalla.

---

## Tecnologías usadas

- Node.js
- Inquirer (menús interactivos en consola)
- lowdb (base de datos JSON local)
- CommonJS Modules
- uuid (IDs únicos)

---

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu_usuario/simulador-rpg-consola.git
```

Instala las dependencias:

```bash
npm install
```
### Cómo jugar

Ejecuta el juego con:

```bash
node index.js
```
Sigue las instrucciones para:

- Crear un nuevo personaje o cargar uno existente.

- Elegir tu clase.

- Batallar contra enemigos.

- Consultar estadísticas o guardar el progreso.

## Estructura del proyecto
``` pgsql
├── index.js
├── package.json
├── data/
│   └── personajes.json
├── src/
│   ├── models/
│   │   ├── personaje.js
│   │   ├── mago.js
│   │   ├── guerrero.js
│   │   └── arquero.js
│   ├── services/
│   │   ├── db.js
│   │   └── gestorBatallas.js
│   └── utils/
│       └── generadorEnemigos.js
```

## Diagrama de clases UML
![Diagrama](Main.png)

## video de sustentacion

https://drive.google.com/drive/folders/19DL6SPB4fuD3SE4lROdYHOuDhAF6sWBx?usp=sharing

## Autores
 - Johan Andrey Guarin
 - Jose Julian Ortega
 - Hely Santiago Diaz