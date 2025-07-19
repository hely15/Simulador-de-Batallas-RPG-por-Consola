const { v4: uuidv4 } = require('uuid');

/**
 * Clase base abstracta para todos los personajes
 * Aplica SRP: responsabilidad única de manejar atributos básicos de personaje
 */
class personaje {
    #id;
    #nombre;
    #nivel;
    #vida;
    #vidaMaxima;
    #mana;
    #manaMaximo;
    #ataque;
    #defensa;
    #velocidad;

    constructor(nombre, clase) {
        if (this.constructor === personaje) {
            throw new Error('No se puede instanciar la clase abstracta personaje');
        }
        
        this.#id = uuidv4();
        this.#nombre = nombre;
        this.#nivel = 1;
        this.clase = clase;
        this.experiencia = 0;
        this.experienciaNecesaria = 100;
        
        // Estadísticas base Se sobreescribiran por las clseas hijas al personalizar el personaje escogido 
        this.#vida = 100;
        this.#vidaMaxima = 100;
        this.#mana = 50;
        this.#manaMaximo = 50;
        this.#ataque = 20;
        this.#defensa = 10;
        this.#velocidad = 10;
    }

    // Obtenemos la informacion del personaje a crear  
    get id() { return this.#id; }
    get nombre() { return this.#nombre; }
    get nivel() { return this.#nivel; }
    get vida() { return this.#vida; }
    get vidaMaxima() { return this.#vidaMaxima; }
    get mana() { return this.#mana; }
    get manaMaximo() { return this.#manaMaximo; }
    get ataque() { return this.#ataque; }
    get defensa() { return this.#defensa; }
    get velocidad() { return this.#velocidad; }

    // Protegemos las variables de vida y mana para que no se puedan establecer valores negativos o mayores a los máximos
    set vida(valor) { 
        this.#vida = Math.max(0, Math.min(valor, this.#vidaMaxima)); 
    }
    set mana(valor) { 
        this.#mana = Math.max(0, Math.min(valor, this.#manaMaximo)); 
    }

    // Protegidos para clases hijas
    _establecerEstadisticas(vida, mana, ataque, defensa, velocidad) {
        this.#vidaMaxima = vida;
        this.#vida = vida;
        this.#manaMaximo = mana;
        this.#mana = mana;
        this.#ataque = ataque;
        this.#defensa = defensa;
        this.#velocidad = velocidad;
    }

    // Subir de nivel
    subirNivel() {
        this.#nivel++;
        this.experiencia = 0;
        this.experienciaNecesaria = Math.floor(this.experienciaNecesaria * 1.5);
        this._mejorarEstadisticas();
    }

    // Método abstracto que deben implementar las clases hijas (LSP)
    _mejorarEstadisticas() {
        throw new Error('Las clases hijas deben implementar _mejorarEstadisticas');
    }

    // Método abstracto para obtener habilidades especiales
    obtenerHabilidades() {
        throw new Error('Las clases hijas deben implementar obtenerHabilidades');
    }

    // Mostrar información del personaje
    obtenerInformacion() {
        return {
            id: this.#id,
            nombre: this.#nombre,
            clase: this.clase,
            nivel: this.#nivel,
            vida: `${this.#vida}/${this.#vidaMaxima}`,
            mana: `${this.#mana}/${this.#manaMaximo}`,
            ataque: this.#ataque,
            defensa: this.#defensa,
            velocidad: this.#velocidad,
            experiencia: `${this.experiencia}/${this.experienciaNecesaria}`
        };
    }

    // Verificar si está vivo
    estaVivo() {
        return this.#vida > 0;
    }
}

module.exports = { personaje };