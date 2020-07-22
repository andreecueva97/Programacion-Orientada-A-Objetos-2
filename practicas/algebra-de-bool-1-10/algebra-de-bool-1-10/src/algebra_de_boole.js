require('@pmoo/oow');

const objetoFalso = {
  negado() {
    return objetoVerdadero
  },
  y(unBooleano) {
    return this;
  }
};
const objetoVerdadero = {
  negado: () => objetoFalso,
  y: (unBooleano) => unBooleano
};

module.exports = {
  verdadero: objetoVerdadero,
  falso: objetoFalso
};
