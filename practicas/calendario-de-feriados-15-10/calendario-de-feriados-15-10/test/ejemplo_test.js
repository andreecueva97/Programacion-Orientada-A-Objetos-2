'use strict';

const { suite, test, before, assert } = require('@pmoo/testy');
const CalendarioDeFeriados = require('../src/calendario_de_feriados');

class ReglaDeFeriado {
  static paraFechaPuntual(fecha) {
    return new ReglaDeFeriadoParaFechaPuntual(fecha);
  }

  static paraDiaDeSemana(unDiaDeLaSemana) {
    return new ReglaDeFeriadoParaDiaDeSemana(unDiaDeLaSemana);
  }

  seCumplePara(unaFecha) {
    throw 'Mensaje abstracto!'
  }
}

class ReglaDeFeriadoParaFechaPuntual extends ReglaDeFeriado {
  constructor(fechaFeriado) {
    super();
    this._fechaFeriado = fechaFeriado;
  }

  seCumplePara(unaFecha) {
    return this._fechaFeriado === unaFecha;
  }
}

class ReglaDeFeriadoParaDiaDeSemana extends ReglaDeFeriado {
  constructor(unDiaDeLaSemana) {
    super();
    this._diaDeLaSemanaFeriado = unDiaDeLaSemana;
  }

  seCumplePara(unaFecha) {
    return this._diaDeLaSemanaFeriado === unaFecha.getDay();
  }
}

suite('calendario de feriados', () => {
  const lunes = 1;
  const unLunes = new Date(2019, 9, 14);
  const otroLunes = new Date(2019, 9, 21);

  const febrero = 1; // porque javascript
  const diciembre = 11; // porque javascript
  const navidad2019 = new Date(2019, diciembre, 25);
  const navidad2020 = new Date(2020, diciembre, 25);
  const unaFechaCualquiera = new Date(1989, febrero, 3);

  let calendario;

  before(() => {
    calendario = new CalendarioDeFeriados();
  });

  test('01 - inicialmente un calendario no tiene ningun dia configurado como feriado', () => {
    assert.isFalse(calendario.esFeriado(unaFechaCualquiera));
  });

  test('02 - podemos configurar un calendario para que una fecha puntual sea feriado', () => {
    let navidad2019EsFeriado = ReglaDeFeriado.paraFechaPuntual(navidad2019);
    calendario.configurarCon(navidad2019EsFeriado);
    assert.isTrue(calendario.esFeriado(navidad2019));
  });

  test('03 - podemos configurar un calendario para que mas de una fecha puntual sea feriado', () => {
    const navidad2019EsFeriado = ReglaDeFeriado.paraFechaPuntual(navidad2019);
    const navidad2020EsFeriado = ReglaDeFeriado.paraFechaPuntual(navidad2020);
    calendario.configurarCon(navidad2019EsFeriado);
    calendario.configurarCon(navidad2020EsFeriado);
    assert.isTrue(calendario.esFeriado(navidad2019));
    assert.isTrue(calendario.esFeriado(navidad2020));
  });

  test('04 - podemos configurar un calendario para que un dia de la semana sea feriado', () => {
    const todosLosLunesEsFeriado = ReglaDeFeriado.paraDiaDeSemana(lunes);
    calendario.configurarCon(todosLosLunesEsFeriado);
    assert.isFalse(calendario.esFeriado(navidad2019)); // cae miercoles
    assert.isTrue(calendario.esFeriado(unLunes));
    assert.isTrue(calendario.esFeriado(otroLunes));
  });
});
