import ApplicationSerializer from './application';

export default class RepositorySerializer extends ApplicationSerializer {
  serialize() {
    let json = super.serialize(...arguments);

    delete json.data.attributes['clone-url'];

    return json;
  }
}
