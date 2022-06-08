import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class CourseStageSolutionController extends Controller {
  @service store;

  get currentLanguage() {
    // TODO: Change this when we actually check for whether solutions are present
    return this.store.peekAll('language').findBy('isGo');
  }

  get requestedLanguage() {
    // TODO: Change this when we support the query param
    return this.store.peekAll('language').findBy('isGo');
  }
}
