import Component from '@glimmer/component';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

import 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-nim';
// import 'prismjs/components/prism-php'; Doesn't work for some reason?
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-clojure';
import 'prismjs/components/prism-crystal';
import 'prismjs/components/prism-elixir';
import 'prismjs/components/prism-haskell';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-swift';

import 'prismjs/components/prism-diff';
import * as Sentry from '@sentry/ember';

export default class CourseStageSolutionModalComponent extends Component {
  @tracked activeTab; // diff/explanation/source_walkthrough
  @tracked modalBodyElement;
  @tracked requestedSolutionLanguage;
  @service store;

  constructor() {
    super(...arguments);

    this.requestedSolutionLanguage = this.args.repositoryLanguage || this.args.courseStage.solutions.sortBy('language.name').firstObject.language;

    // intent is either view_solution or view_source_walkthrough
    if (this.args.intent === 'view_solution' && this.solution) {
      if (this.solution) {
        this.activeTab = this.solution.hasExplanation ? 'explanation' : 'diff';
      } else {
        Sentry.captureMessage('Received view_solution intent when solution is not available');
        this.activeTab = 'source_walkthrough';
      }
    } else {
      this.activeTab = 'source_walkthrough';
    }

    this.emitAnalyticsEvent();
  }

  emitAnalyticsEvent() {
    if (this.activeTab === 'diff' || this.activeTab === 'explanation') {
      this.store
        .createRecord('analytics-event', {
          name: this.activeTab === 'explanation' ? 'viewed_course_stage_solution_explanation' : 'viewed_course_stage_solution_diff',
          properties: {
            course_slug: this.args.courseStage.course.slug,
            course_stage_slug: this.args.courseStage.slug,
            language_slug: this.solution.language.slug,
            requested_language_slug: this.requestedSolutionLanguage.slug,
          },
        })
        .save();
    } else if (this.activeTab === 'source_walkthrough') {
      this.store
        .createRecord('analytics-event', {
          name: 'viewed_course_stage_source_walkthrough',
          properties: {
            course_slug: this.args.courseStage.course.slug,
            course_stage_slug: this.args.courseStage.slug,
          },
        })
        .save();
    }
  }

  @action
  handleDidInsertModalBody(modalBodyElement) {
    this.modalBodyElement = modalBodyElement;
  }

  @action
  handleTabLinkClick(tab) {
    this.activeTab = tab;
    this.modalBodyElement.scrollTo({ top: 0, behavior: 'smooth' });
    this.emitAnalyticsEvent();
  }

  @action
  handleRequestedSolutionLanguageChange(requestedSolutionLanguage) {
    this.requestedSolutionLanguage = requestedSolutionLanguage;
    this.emitAnalyticsEvent();
  }

  get solution() {
    const solutionForRequestedLanguage = this.args.courseStage.solutions.findBy('language', this.requestedSolutionLanguage);

    return solutionForRequestedLanguage ? solutionForRequestedLanguage : this.args.courseStage.solutions.sortBy('language.name').firstObject;
  }
}
