import Controller from '@ember/controller';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type { CodeExampleInsightsRouteModel } from 'codecrafters-frontend/routes/course-admin/code-example-insights';

export default class CodeExampleInsightsController extends Controller {
  declare model: CodeExampleInsightsRouteModel;

  @service declare router: RouterService;

  @action
  handleCourseStageChange(stage: CourseStageModel) {
    console.log('handleCourseStageChange', stage.slug);
    // Get the current language_slug query param if present
    const languageSlug = this.router.currentRoute.queryParams['language_slug'];
    // Transition to the route with the stage slug as a model param and preserve language_slug
    this.router.transitionTo(
      'course-admin.code-example-insights',
      stage.slug,
      { queryParams: { language_slug: languageSlug } }
    );
  }

  @action
  handleRequestedLanguageChange(language: LanguageModel) {
    this.router.transitionTo({ queryParams: { language_slug: language.slug } });
  }
}
