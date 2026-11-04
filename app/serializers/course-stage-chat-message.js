import ApplicationSerializer from './application';

export default class CourseStageChatMessageSerializer extends ApplicationSerializer {
  serialize(snapshot, options) {
    const json = super.serialize(snapshot, options);

    if (snapshot.record.isNew) {
      const attributes = {};

      if (json.data.attributes.body != null) {
        attributes.body = json.data.attributes.body;
      }

      if (json.data.attributes['input-mode'] != null) {
        attributes['input-mode'] = json.data.attributes['input-mode'];
      }

      if (json.data.attributes['research-source-names']?.length) {
        attributes['research-source-names'] = json.data.attributes['research-source-names'];
      }

      json.data.attributes = attributes;

      const relationships = {};

      if (json.data.relationships?.repository) {
        relationships.repository = json.data.relationships.repository;
      }

      if (json.data.relationships?.['course-stage']) {
        relationships['course-stage'] = json.data.relationships['course-stage'];
      }

      json.data.relationships = relationships;
    } else {
      json.data.attributes = {
        rating: json.data.attributes.rating ?? null,
      };
      delete json.data.relationships;
    }

    return json;
  }
}
