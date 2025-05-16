import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type LanguageModel from 'codecrafters-frontend/models/language';
import Store from '@ember-data/store';
import type { ModelType } from 'codecrafters-frontend/routes/course-admin/code-example-insights-index';

export default class CodeExampleInsightsIndexController extends Controller {
  @service declare router: RouterService;
  @service declare store: Store;

  declare model: ModelType;

  @action
  onLanguageChange(language: LanguageModel | null) {
    if (language) {
      this.router.transitionTo({
        queryParams: { language_slug: language.slug },
      });
    } else {
      this.router.transitionTo({
        queryParams: {},
      });
    }
  }
}
