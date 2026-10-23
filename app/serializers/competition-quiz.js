import ApplicationSerializer from './application';

const REVIEW_ATTRIBUTES = ['isRetakeAllowed', 'reviewDecision', 'reviewNote'];

export default class CompetitionQuizSerializer extends ApplicationSerializer {
  // Each panel sends only what it changed, so a page that's out of date can't undo another reviewer's save.
  serializeAttribute(snapshot, json, key, attribute) {
    const attributesToSend = snapshot.adapterOptions?.attributes || REVIEW_ATTRIBUTES;

    if (attributesToSend.includes(key)) {
      super.serializeAttribute(snapshot, json, key, attribute);
    }
  }
}
