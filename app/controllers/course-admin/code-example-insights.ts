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
import * as Sentry from '@sentry/ember';

export default class CodeExampleInsightsController extends Controller {
  queryParams = ['sort_mode'];

  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  @tracked expandedSolution: CommunityCourseStageSolutionModel | null = null;
  @tracked sort_mode: 'newest' | 'shortest_diff' | 'shortest_highlights' = 'newest';

  declare model: CodeExampleInsightsRouteModel;

  get sortModeHumanized(): string {
    if (this.sort_mode === 'shortest_diff') {
      return 'Diff size';
    } else if (this.sort_mode === 'shortest_highlights') {
      return 'Highlight size';
    } else if (this.sort_mode === 'newest') {
      return 'Recency';
    } else {
      Sentry.captureException(new Error(`Unknown sort mode: ${this.sort_mode}`));

      return 'Unknown';
    }
  }

  get sortModeOrderDescription(): string {
    if (this.sort_mode === 'shortest_diff') {
      return 'smallest first';
    } else if (this.sort_mode === 'shortest_highlights') {
      return 'smallest first';
    } else if (this.sort_mode === 'newest') {
      return 'most recent first';
    } else {
      Sentry.captureException(new Error(`Unknown sort mode: ${this.sort_mode}`));

      return 'Unknown';
    }
  }

  get sortedLanguagesForDropdown() {
    return this.model.courseStage.course.betaOrLiveLanguages.sortBy('name');
  }

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
  setSortMode(mode: 'newest' | 'shortest_diff' | 'shortest_highlights') {
    this.router.transitionTo({ queryParams: { sort_mode: mode } });
  }
}
