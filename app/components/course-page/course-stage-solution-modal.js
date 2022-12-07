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

export default class CourseStageSolutionModalComponent extends Component {
  @tracked activeTab; // community_solutions/verified_solution/source_walkthrough
  @tracked modalBodyElement;
  @tracked requestedSolutionLanguage;
  @service store;

  constructor() {
    super(...arguments);

    this.requestedSolutionLanguage = this.args.repository.language || this.args.courseStage.solutions.sortBy('language.name').firstObject.language;

    // intent is either view_solution or view_source_walkthrough
    if (this.args.intent === 'view_solution') {
      if (this.args.courseStage.isFirst && this.solution) {
        this.activeTab = 'verified_solution';
      } else {
        this.activeTab = 'community_solutions';
      }
    } else if (this.args.intent === 'view_source_walkthrough') {
      this.activeTab = 'source_walkthrough';
    } else if (this.args.intent === 'view_comments') {
      this.activeTab = 'comments';
    }

    this.emitAnalyticsEvent();
  }

  emitAnalyticsEvent() {
    if (this.activeTab === 'verified_solution') {
      this.store
        .createRecord('analytics-event', {
          name: 'viewed_course_stage_solution',
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
  handleDidInsertLanguageDropdown(dd) {
    if (dd) {
      this.languageDropdown = dd; // This is called with null when the dropdown is destroyed, and we use it for two different dropdowns
    }
  }

  @action
  handleViewCommentsButtonClick() {
    this.activeTab = 'comments';
  }

  @action
  handleViewCommunitySolutionsInOtherLanguagesButtonClick() {
    this.languageDropdown.actions.open();
  }

  @action
  handleViewVerifiedSolutionInOtherLanguagesButtonClick() {
    this.languageDropdown.actions.open();
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

    if (this.activeTab === 'verified_solution' && !this.solution) {
      this.activeTab = 'community_solutions';
    }

    this.emitAnalyticsEvent();
  }

  get solution() {
    return this.args.courseStage.solutions.findBy('language', this.requestedSolutionLanguage);
  }
}
