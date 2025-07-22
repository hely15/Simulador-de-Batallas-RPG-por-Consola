class IAtacante {
    atacar(objetivo) {
      throw new Error("Método atacar debe ser implementado")
    }
  }
  
  class ICurable {
    curar(objetivo) {
      throw new Error("Método curar debe ser implementado")
    }
  }
  
  class IUsaMagia {
    lanzarHechizo(hechizo, objetivo) {
      throw new Error("Método lanzarHechizo debe ser implementado")
    }
  }
  
  class IUsaArmas {
    equiparArma(arma) {
      throw new Error("Método equiparArma debe ser implementado")
    }
  }
  
  class INotificador {
    notificar(mensaje, tipo = "info") {
      throw new Error("Método notificar debe ser implementado")
    }
  }
  
  class IGuardador {
    guardar(datos) {
      throw new Error("Método guardar debe ser implementado")
    }
  
    cargar() {
      throw new Error("Método cargar debe ser implementado")
    }
  }
  
  module.exports = {
    IAtacante,
    ICurable,
    IUsaMagia,
    IUsaArmas,
    INotificador,
    IGuardador,
  }
  