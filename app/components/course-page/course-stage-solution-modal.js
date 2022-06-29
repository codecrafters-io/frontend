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

import 'prismjs/components/prism-diff';

export default class CourseStageSolutionModalComponent extends Component {
  @tracked isViewingExplanation; // explanation/diff
  @tracked requestedLanguage;
  @service store;

  constructor() {
    super(...arguments);

    this.requestedLanguage = this.args.repositoryLanguage || this.args.courseStage.solutions.firstObject.language;

    if (this.solution.hasExplanation) {
      this.isViewingExplanation = true;
    }

    this.emitAnalyticsEvent();
  }

  emitAnalyticsEvent() {
    this.store
      .createRecord('analytics-event', {
        name: this.isViewingExplanation ? 'viewed_course_stage_solution_explanation' : 'viewed_course_stage_solution_diff',
        properties: {
          course_slug: this.args.courseStage.course.slug,
          course_stage_slug: this.args.courseStage.slug,
          language_slug: this.solution.language.slug,
          requested_language_slug: this.requestedLanguage.slug,
        },
      })
      .save();
  }

  @action
  handleViewDiffLinkClick() {
    this.isViewingExplanation = false;
    this.emitAnalyticsEvent();
  }

  @action
  handleViewExplanationLinkClick() {
    this.isViewingExplanation = true;
    this.emitAnalyticsEvent();
  }

  @action
  handleRequestedLanguageChange(requestedLanguage) {
    this.requestedLanguage = requestedLanguage;
    this.emitAnalyticsEvent();
  }

  get isViewingDiff() {
    return !this.isViewingExplanation;
  }

  get solution() {
    const solutionForRequestedLanguage = this.args.courseStage.solutions.findBy('language', this.requestedLanguage);

    return solutionForRequestedLanguage ? solutionForRequestedLanguage : this.args.courseStage.solutions.firstObject;
  }
}
