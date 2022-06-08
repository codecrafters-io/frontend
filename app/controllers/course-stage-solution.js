import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CourseStageSolutionController extends Controller {
  @service store;
  @tracked requestedLanguageSlug = 'go';

  queryParams = [
    {
      requestedLanguageSlug: 'language',
    },
  ];

  get currentLanguage() {
    return this.solution.language;
  }

  get requestedLanguage() {
    if (this.requestedLanguageSlug) {
      return this.store.peekAll('language').findBy('slug', this.requestedLanguageSlug);
    } else {
      return this.solution.language;
    }
  }

  get solution() {
    return this.model;
  }
}
