'use strict';

const { Testy } = require('@pmoo/testy');

Testy.configuredWith({
  // relative path to the folder with tests
  directory: './test',
  // 'en' is the default. For example, you can try 'es' to see output in Spanish
  language: 'en',
  // Stops at the first failed or errored test. false by default
  failFast: false,
}).run();
