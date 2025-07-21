const { personaje } = require('./personaje');

class Enemigo extends personaje {
    constructor(nombre = "Enemigo Salvaje", nivel = 1) {
        super(nombre, "Enemigo");
        this.nivel = nivel;
        this.tipo = "enemigo";
        this.experiencia = 0;
        this.experienciaNecesaria = 100;
        this.generarStats();
    }

    generarStats() {
        this.vida = 50 + this.nivel * 10;
        this.mana = 20 + this.nivel * 5;
        this.ataque = 10 + this.nivel * 2;
        this.defensa = 5 + this.nivel;
        this.velocidad = 5 +this.nivel
    }

    obtenerHabilidades() {
        return['ataqueBasico', 'ataqueFuerte', 'curarse'];
    }

    elegirHabilidad(){
        const habilidades =this.obtenerHabilidades();
        return  habilidades [Math.floor(Math.random() * habilidades.length)]
    }

    obtenerInformacion() {
        const info = super.obtenerInformacion();
        return {
            ...info,
            tipo: this.tipo,
            nivel: this.nivel,
            habilidades: this.obtenerHabilidades()
        };
    }

}

module.exports = { Enemigo };
