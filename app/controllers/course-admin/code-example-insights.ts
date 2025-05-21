import { tracked } from '@glimmer/tracking';
import { next } from '@ember/runloop';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type { CodeExampleInsightsRouteModel } from 'codecrafters-frontend/routes/course-admin/code-example-insights';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export default class CodeExampleInsightsController extends Controller {
  declare model: CodeExampleInsightsRouteModel;

  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  @tracked expandedSolution: CommunityCourseStageSolutionModel | null = null;

  @action
  handleCourseStageChange(stage: CourseStageModel) {
    console.log('handleCourseStageChange', stage.slug);
    // Get the current language_slug query param if present
    const languageSlug = this.router.currentRoute.queryParams['language_slug'];
    // Transition to the route with the stage slug as a model param and preserve language_slug
    this.router.transitionTo('course-admin.code-example-insights', stage.slug, { queryParams: { language_slug: languageSlug } });
  }

  @action
  handleRequestedLanguageChange(language: LanguageModel) {
    this.router.transitionTo({ queryParams: { language_slug: language.slug } });
  }

  @action
  handleSolutionExpandButtonClick(solution: CommunityCourseStageSolutionModel, solutionIndex: number, containerElement: HTMLDivElement) {
    if (this.authenticator.isAuthenticated) {
      solution.createView({ position_in_list: solutionIndex + 1 });
    }

    this.expandedSolution = solution;

    next(() => {
      containerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}
