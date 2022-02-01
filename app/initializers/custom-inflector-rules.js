// import Inflector from 'ember-inflector';

export function initialize(/* application */) {
  // We aren't using free-usage-quota anymore, keeping this here for easy reference
  // const inflector = Inflector.inflector;
  // inflector.irregular('quota', 'quotas'); // By default, the singular form of quota is quotom.
}

export default {
  name: 'custom-inflector-rules',
  before: 'ember-cli-mirage',
  initialize,
};
