import Inflector from 'ember-inflector';

export function initialize(/* application */) {
  const inflector = Inflector.inflector;

  inflector.uncountable('quota'); // By default, the singular form of quota is quotom.
}

export default {
  name: 'custom-inflector-rules',
  before: 'ember-cli-mirage',
  initialize,
};
