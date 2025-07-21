const {personaje} = require('./personaje');

/**
 * Clase Guerrero - especializado en combate cuerpo a cuerpo
 * Aplica OCP: extiende personaje sin modificarlo
 * Aplica LSP: puede usarse como instancia de personaje
 */

class Guerrero extends personaje {
    constructor(nombre) {
        super(nombre, "Guerrero");

        // Estadisticas basicas del Guerrero 
        this._establecerEstadisticas(150, 30, 25, 15, 8);
        //se establece en vida, mana, ataque, defensa y velocidad en ese ordfen

        this.habilidadesEspeciales = [
            "Golpe Devastador",
            "Berseker",
            "Escudo Defensivo"
        ];
    }

    // Implementamos polimorfismo¡¡¡¡¡
    _mejorarEstadisticas() {
        const mejoras = this._calcularMejoras();
        this._establecerEstadisticas(
            this.vidaMaxima + mejoras.vida,
            this.manaMaximo + mejoras.mana,
            this.ataque + mejoras.ataque,
            this.defensa + mejoras.defensa,
            this.velocidad + mejoras.velocidad
        );
    }

    _calcularMejoras() {
        return {
            vida: 25,
            mana: 5,
            ataque: 8,
            defensa: 5,
            velocidad: 2
        };
    }

    // metodo abstracto 
    obtenerHabilidades() {
        return this.habilidadesEspeciales;
    }

    // Habilidad Guerrero
    golpeDevastador(objetivo) {
        const danioBase = this.ataque * 1.8;
        const costoMana = 20;
        
        if (this.mana < costoMana) {
            return { exito: false, mensaje: 'No tienes suficiente mana' };
        }

        this.mana -= costoMana;
        return {
            exito: true,
            danio: Math.floor(danioBase),
            mensaje: `${this.nombre} ejecuta un Golpe Devastador!`
        };
    }


    // Habilidad de berserker
    berserker() {
        const costoMana = 15;
        
        if (this.mana < costoMana) {
            return { exito: false, mensaje: 'No tienes suficiente mana' };
        }

        this.mana -= costoMana;
        const ataqueOriginal = this.ataque;
        
        return {
            exito: true,
            mensaje: `${this.nombre} entra en modo Berserker! Ataque aumentado temporalmente.`,
            efecto: 'ataque_aumentado',
            duracion: 3
        };
    }


    // Obtener informacion 
    obtenerInformacion() {
        const infoBase = super.obtenerInformacion();
        return {
            ...infoBase,
            especialidad: 'Combate cuerpo a cuerpo',
            habilidades: this.habilidadesEspeciales
        };
    }
}

module.exports = { Guerrero };