'use strict';

require('@pmoo/oow');

const CasoDePluralizacion = {
  todos: () => [
    CasoInvalidoPorTextoQueNoEsUnaPalabra,
    CasoInvalidoPorCantidadNegativa,
    CasoSingular,
    CasoPlural
  ],
  aplicaPara: (palabra, cantidad) => { throw 'abstract!' },
  pluralizar: (palabra, cantidad) => { throw 'abstract!' }
}

const CasoInvalidoPorTextoQueNoEsUnaPalabra = {
  __proto__: CasoDePluralizacion,
  aplicaPara: (palabra) => !palabra.match(/^[a-zA-Z]+$/),
  pluralizar: () => { throw 'la palabra no es válida' }
};

const CasoInvalidoPorCantidadNegativa = {
  __proto__: CasoDePluralizacion,
  aplicaPara: (palabra, cantidad) => cantidad < 0,
  pluralizar: () => { throw 'la cantidad no es válida' }
};

const CasoSingular = {
  __proto__: CasoDePluralizacion,
  aplicaPara: (palabra, cantidad) => cantidad === 1,
  pluralizar: (palabra, cantidad) => `${cantidad} ${palabra}`
};

const CasoPlural = {
  __proto__: CasoDePluralizacion,
  aplicaPara: (palabra, cantidad) => cantidad !== 1,
  pluralizar: (palabra, cantidad) => `${cantidad} ${palabra}s`
};

class Pluralizador {
  constructor(palabra, cantidad) {
    this.palabra = palabra;
    this.cantidad = cantidad;
  }
  
  pluralizar() {
    return this.casoDePluralizacion()
      .pluralizar(this.palabra, this.cantidad)
  }
  
  casoDePluralizacion() {
    return this.casosDePluralizacion().find(
      caso => caso.aplicaPara(this.palabra, this.cantidad)
    )
  }
  
  casosDePluralizacion() {
    return CasoDePluralizacion.todos();
  }
}

module.exports = Pluralizador;
