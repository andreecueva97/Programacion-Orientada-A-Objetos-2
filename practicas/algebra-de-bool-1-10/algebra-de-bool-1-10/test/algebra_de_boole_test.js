const { suite, test, assert } = require('@pmoo/testy');
const { verdadero, falso } = require('../src/algebra_de_boole');

suite('algebra de boole', () => {
  test('verdadero negado es falso', () => {
    assert.that(verdadero.negado()).isEqualTo(falso);
  });

  test('falso negado es verdadero', () => {
    assert.that(falso.negado()).isEqualTo(verdadero);
  });

  test('AND es falso si alguna de las dos partes es falsa', () => {
    assert.that(falso.y(verdadero)).isEqualTo(falso);
    assert.that(verdadero.y(falso)).isEqualTo(falso);
    assert.that(falso.y(falso)).isEqualTo(falso);
  });

  test('AND es verdadero si ambas partes son verdaderas', () => {
    assert.that(verdadero.y(verdadero)).isEqualTo(verdadero);
  });
});
