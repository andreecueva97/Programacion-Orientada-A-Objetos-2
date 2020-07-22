'use strict';

const { suite, test, assert } = require('@pmoo/testy');
const Pluralizador = require('../src/pluralizador');

suite('Pluralizador', () => {
  test('01 - palabra en singular queda igual', () => {
    assert.areEqual(new Pluralizador('cosa', 1).pluralizar(), '1 cosa');
  });
  test('02 - palabra en plural agregando "s" al final', () => {
    assert.areEqual(new Pluralizador('cosa', 2).pluralizar(), '2 cosas');
  });
  test('03 - palabra con cantidad 0 va en plural', () => {
    assert.areEqual(new Pluralizador('cosa', 0).pluralizar(), '0 cosas');
  });
  test('04 - si no es una palabra se lanza un error', () => {
    assert.that(
      () => { new Pluralizador('12cosa', 0).pluralizar() }
    ).raises('la palabra no es válida');
  });
  
  test('05 - si la cantidad es negativa se lanza un error', () => {
    assert.that(
      () => { new Pluralizador('marcador', -3).pluralizar() }
    ).raises('la cantidad no es válida');
  });

  test('06 - no se lanza error si la cantidad y la palabra son validos', () => {
    assert.that(
      () => { new Pluralizador('marcador', 3).pluralizar() }
    ).doesNotRaiseAnyErrors();
  });
});
