import Component from '@glimmer/component';
import Prism from 'prismjs';
import showdown from 'showdown';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CoursePageCourseStageSolutionComponent extends Component {
  @service store;
  @tracked revealSolutionOverlayWasDisabledByUser = false;

  constructor() {
    super(...arguments);
    this.emitAnalyticsEvent();
  }

  @action
  emitAnalyticsEvent() {
    if (!this.shouldShowRevealSolutionOverlay) {
      this.store
        .createRecord('analytics-event', {
          name: 'viewed_course_stage_solution',
          properties: {
            course_slug: this.args.courseStage.course.slug,
            course_stage_slug: this.args.courseStage.slug,
            language_slug: this.args.solution.language.slug,
            requested_language_slug: this.args.requestedSolutionLanguage.slug,
          },
        })
        .save();
    }
  }

  get explanationHTML() {
    if (this.args.solution.explanationMarkdown) {
      return htmlSafe(new showdown.Converter().makeHtml(this.args.solution.explanationMarkdown));
    } else {
      return htmlSafe(new showdown.Converter().makeHtml(`This solution does not have an explanation yet.`));
    }
  }

  @action
  handleDidInsertExplanationHTML(element) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleDidUpdateExplanationHTML(element) {
    Prism.highlightAllUnder(element);
  }

  @action
  async handleRevealSolutionsButtonClick() {
    this.revealSolutionOverlayWasDisabledByUser = true;
  }

  get hasCompletedStage() {
    return this.args.repository.stageIsComplete(this.args.courseStage);
  }

  get shouldShowRevealSolutionOverlay() {
    // For the first stage, let users view anyway
    if (this.args.courseStage.isFirst) {
      return false;
    }

    // If we don't have solutions, don't make it look like we do
    if (!this.solutionsAreAvailableForCurrentLanguage) {
      return false;
    }

    // Only show if viewing for the current repository's language
    if (this.args.requestedSolutionLanguage !== this.args.repository.language) {
      return false;
    }

    // If we have solutions and the user hasn't completed the stage, show the overlay
    return !this.hasCompletedStage && !this.revealSolutionOverlayWasDisabledByUser;
  }

  get solutionsAreAvailableForCurrentLanguage() {
    return this.args.courseStage.hasSolutionForLanguage(this.args.requestedSolutionLanguage);
  }
}
