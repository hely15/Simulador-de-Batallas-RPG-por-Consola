const {personaje} = require('./personaje');

/**
 * Clase Arquero - especializado en combate a distancia y velocidad
 * Aplica OCP: extiende Personaje sin modificarlo
 * Aplica LSP: puede usarse como instancia de Personaje
*/

class Arquero extends personaje {
    constructor(nombre) {
        super(nombre, "Arquero");

        // Estadisticas basicas del Arquero
        this._establecerEstadisticas(110, 70, 28, 12, 18);
        //se establece en vida, mana, ataque, defensa y velocidad en ese orden

        this.habilidadesEspeciales = [
            "Disparo Certero",
            "Lluvia de Flechas",
            "Trampa de Fuego"
        ];

        this.flechas = 50; //flechas iniciales 
        this.precision = 85; //porcentaje de presicion 
    }

    //polimorfismo 
    _mejorarEstadisticas() {
        const mejoras = this._calcularMejoras();
        this._establecerEstadisticas(
            this.vidaMaxima + mejoras.vida,
            this.manaMaximo + mejoras.mana,
            this.ataque + mejoras.ataque,
            this.defensa + mejoras.defensa,
            this.velocidad + mejoras.velocidad
        );

        //mejora de presicion 
        this.precision = Math.min(95, this.precision + 2);
    }

    _calcularMejoras() {
        return {
            vida: 20,
            mana: 10,
            ataque: 6,
            defensa: 3,
            velocidad: 4
        };
    }


    obtenerHabilidades() {
        return this.habilidadesEspeciales;
    }

    //disparo Certero
    disparoCertero(objetivo) {
        const costoMana = 15;
        const costoFlechas = 1;
        
        if (this.mana < costoMana) {
            return { exito: false, mensaje: 'No tienes suficiente mana' };
        }
        
        if (this.flechas < costoFlechas) {
            return { exito: false, mensaje: 'No tienes suficientes flechas' };
        }

        this.mana -= costoMana;
        this.flechas -= costoFlechas;
        
        //disparo certero tiene mayor precisión
        const danioBase = this.ataque * 1.5;
        const precisionMejorada = Math.min(100, this.precision + 15);
        
        return {
            exito: true,
            danio: Math.floor(danioBase),
            precision: precisionMejorada,
            tipo: 'fisico',
            critico: true,
            mensaje: `${this.nombre} ejecuta un Disparo Certero!`
        };
    }

    //lluvia de Flechas
    lluviaDeFlechas(objetivos) {
        const costoMana = 35;
        const costoFlechas = 5;
        
        if (this.mana < costoMana) {
            return { exito: false, mensaje: 'No tienes suficiente mana' };
        }
        
        if (this.flechas < costoFlechas) {
            return { exito: false, mensaje: 'No tienes suficientes flechas' };
        }

        this.mana -= costoMana;
        this.flechas -= costoFlechas;
        
        const danioBase = this.ataque * 0.8; // Menor daño por flecha
        
        return {
            exito: true,
            danio: Math.floor(danioBase),
            tipo: 'area',
            objetivos: objetivos.length,
            mensaje: `${this.nombre} lanza una Lluvia de Flechas!`
        };
    }

    //tiro Explosivo
    tiroExplosivo(objetivo) {
        const costoMana = 25;
        const costoFlechas = 1;
        
        if (this.mana < costoMana) {
            return { exito: false, mensaje: 'No tienes suficiente mana' };
        }
        
        if (this.flechas < costoFlechas) {
            return { exito: false, mensaje: 'No tienes suficientes flechas' };
        }

        this.mana -= costoMana;
        this.flechas -= costoFlechas;
        
        const danioBase = this.ataque * 1.3;
        
        return {
            exito: true,
            danio: Math.floor(danioBase),
            tipo: 'explosivo',
            efecto: 'aturdido',
            duracion: 1,
            mensaje: `${this.nombre} dispara una flecha explosiva!`
        };
    }

    //recargar flechas
    recargarFlechas(cantidad = 30) {
        this.flechas += cantidad;
        return `${this.nombre} recarga ${cantidad} flechas. Total: ${this.flechas}`;
    }

    //mostrar información específica
    obtenerInformacion() {
        const infoBase = super.obtenerInformacion();
        return {
            ...infoBase,
            especialidad: 'Combate a distancia',
            habilidades: this.habilidadesEspeciales,
            flechas: this.flechas,
            precision: `${this.precision}%`
        };
    }
}

module.exports = { Arquero };
