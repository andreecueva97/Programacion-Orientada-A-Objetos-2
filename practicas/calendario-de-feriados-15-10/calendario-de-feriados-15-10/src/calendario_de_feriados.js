require('@pmoo/oow');

class CalendarioDeFeriados {
  constructor() {
    this._reglasDeFeriados = [];
  }

  configurarCon(unaReglaDeFeriados) {
    this._reglasDeFeriados.push(unaReglaDeFeriados);
  }

  esFeriado(unaFecha) {
    return this._reglasDeFeriados.any(regla => regla.seCumplePara(unaFecha));
  }
}

module.exports = CalendarioDeFeriados;
