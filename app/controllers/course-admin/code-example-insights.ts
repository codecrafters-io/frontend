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
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  @tracked expandedSolution: CommunityCourseStageSolutionModel | null = null;
  @tracked sortMode: 'diff-size' | 'recency' = 'diff-size';

  declare model: CodeExampleInsightsRouteModel;

  get sortedSolutions(): CommunityCourseStageSolutionModel[] {
    if (!this.model?.solutions) return [];

    if (this.sortMode === 'diff-size') {
      // Sort by (added_lines_count + removed_lines_count), ascending
      return [...this.model.solutions].sort((a: CommunityCourseStageSolutionModel, b: CommunityCourseStageSolutionModel) => {
        return a.totalChangedLinesInDiff - b.totalChangedLinesInDiff;
      });
    } else if (this.sortMode === 'recency') {
      // Sort by submittedAt, descending (most recent first)
      return [...this.model.solutions].sort((a: CommunityCourseStageSolutionModel, b: CommunityCourseStageSolutionModel) => {
        return new Date(b.submittedAt ?? '').getTime() - new Date(a.submittedAt ?? '').getTime();
      });
    }

    return this.model.solutions;
  }

  @action
  handleCourseStageChange(stage: CourseStageModel) {
    console.log('handleCourseStageChange', stage.slug);
    const languageSlug = this.router.currentRoute.queryParams['language_slug'];

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

  @action
  setSortMode(mode: 'diff-size' | 'recency') {
    this.sortMode = mode;
  }
}
