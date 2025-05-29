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
  queryParams = ['sort_mode'];

  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  @tracked expandedSolution: CommunityCourseStageSolutionModel | null = null;
  @tracked sort_mode: 'shortest_diff' | 'newest' = 'newest';

  declare model: CodeExampleInsightsRouteModel;

  get sortedSolutions(): CommunityCourseStageSolutionModel[] {
    // The API handles the sorting order
    return this.model.solutions;
  }

  @action
  handleCourseStageChange(stage: CourseStageModel) {
    const languageSlug = this.router.currentRoute.queryParams['language_slug'];

    this.router.transitionTo('course-admin.code-example-insights', stage.slug, { queryParams: { language_slug: languageSlug } });
  }

  @action
  handleRequestedLanguageChange(language: LanguageModel) {
    this.router.transitionTo({ queryParams: { language_slug: language.slug } });
  }

  @action
  handleSolutionExpandButtonClick(solution: CommunityCourseStageSolutionModel, containerElement: HTMLDivElement) {
    this.expandedSolution = solution;

    next(() => {
      containerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  @action
  setSortMode(mode: 'shortest_diff' | 'newest') {
    this.router.transitionTo({ queryParams: { sort_mode: mode } });
  }
}
