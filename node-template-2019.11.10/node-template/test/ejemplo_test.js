'use strict';

const { suite, test, assert, before } = require('@pmoo/testy');
const { numero } = require('../src/ejemplo');

suite('suite de ejemplo', () => {
  let numeroEsperado;
  
  before(() => {
    numeroEsperado = 42;
  });
  
  test('un test verdadero', () => {
    assert.isTrue(true);
  });
  
  test('un test de igualdad', () => {
    assert.that(numero).isEqualTo(numeroEsperado);
  });
});
