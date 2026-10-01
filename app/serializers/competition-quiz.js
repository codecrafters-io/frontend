import ApplicationSerializer from './application';

export default class CompetitionQuizSerializer extends ApplicationSerializer {
  serialize() {
    const json = super.serialize(...arguments);
    const attributes = json.data.attributes;

    json.data.attributes = { 'review-decision': attributes['review-decision'], 'review-note': attributes['review-note'] };

    return json;
  }
}
