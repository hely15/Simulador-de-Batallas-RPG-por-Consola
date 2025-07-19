const {personaje} = requiere('./personaje');

/**
 * Clase Mago - especializado en magia y hechizos
 * Aplica OCP: extiende personaje sin modificarlo
 * Aplica LSP: puede usarse como instancia de personaje
*/



class Mago extends personaje {
    constructor(nombre) {
        super(nombre, 'Mago');
        
        //estadisticas basicas del Mago
        this._establecerEstadisticas(80, 120, 15, 8, 12);
        //se establece en vida, mana, ataque, defensa y velocidad en ese orden

        this.habilidadesEspeciales = [
            'Bola de Fuego',
            'Curación',
            'Rayo de Hielo'
        ];
        
        this.grimorio = ['Fuego', 'Hielo', 'Curación', 'Rayo'];
    }

    // Implementación del método abstracto (polimorfismo)
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
            vida: 15,
            mana: 20,
            ataque: 3,
            defensa: 2,
            velocidad: 3
        };
    }

    //método abstracto
    obtenerHabilidades() {
        return this.habilidadesEspeciales;
    }

    //bola de Fuego
    bolaDeFuego(objetivo) {
        const danioBase = this.mana * 0.8;
        const costoMana = 25;
        
        if (this.mana < costoMana) {
            return { exito: false, mensaje: 'No tienes suficiente mana' };
        }

        this.mana -= costoMana;
        return {
            exito: true,
            danio: Math.floor(danioBase),
            tipo: 'magico',
            mensaje: `${this.nombre} lanza una Bola de Fuego!`
        };
    }

    //curación
    curacion(objetivo = null) {
        const costoMana = 20;
        
        if (this.mana < costoMana) {
            return { exito: false, mensaje: 'No tienes suficiente mana' };
        }

        this.mana -= costoMana;
        const curacionCantidad = Math.floor(this.mana * 0.5);
        
        // Si no se especifica objetivo, se cura a sí mismo
        const objetivoCuracion = objetivo || this;
        objetivoCuracion.vida += curacionCantidad;

        return {
            exito: true,
            curacion: curacionCantidad,
            mensaje: `${this.nombre} lanza un hechizo de curación!`
        };
    }

    //rayo de Hielo
    rayoDeHielo(objetivo) {
        const danioBase = this.mana * 0.6;
        const costoMana = 30;
        
        if (this.mana < costoMana) {
            return { exito: false, mensaje: 'No tienes suficiente mana' };
        }

        this.mana -= costoMana;
        return {
            exito: true,
            danio: Math.floor(danioBase),
            tipo: 'magico',
            efecto: 'congelado',
            duracion: 2,
            mensaje: `${this.nombre} lanza un Rayo de Hielo que congela al enemigo!`
        };
    }

    //mostrar información específica
    obtenerInformacion() {
        const infoBase = super.obtenerInformacion();
        return {
            ...infoBase,
            especialidad: 'Magia y hechizos',
            habilidades: this.habilidadesEspeciales,
            grimorio: this.grimorio
        };
    }
}

module.exports = { Mago };