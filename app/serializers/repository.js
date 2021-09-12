import ApplicationSerializer from './application';

export default class RepositorySerializer extends ApplicationSerializer {
  serialize(snapshot, options) {
    let json = super.serialize(...arguments);

    delete json.data.attributes['clone-url'];

    return json;
  }
}
