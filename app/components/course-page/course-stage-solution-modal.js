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
  @tracked courseStage;
  @tracked modalBodyElement;
  @tracked requestedSolutionLanguage;
  @service store;

  constructor() {
    super(...arguments);

    this.courseStage = this.args.courseStage;
    this.requestedSolutionLanguage = this.args.repository.language || this.courseStage.solutions.sortBy('language.name').firstObject.language;

    this.computeActiveTabFromIntent();
    this.emitAnalyticsEvent();
  }

  tabIsAvailableForCourseStage(tab) {
    if (tab === 'verified_solution') {
      return !!this.solution;
    } else if (tab === 'source_walkthrough') {
      return this.courseStage.hasSourceWalkthrough;
    } else {
      return true;
    }
  }

  computeActiveTabFromIntent() {
    // intent is either view_solution or view_source_walkthrough
    if (this.args.intent === 'view_solution') {
      if (this.courseStage.isFirst && this.solution) {
        this.activeTab = 'verified_solution';
      } else {
        this.activeTab = 'community_solutions';
      }
    } else if (this.args.intent === 'view_source_walkthrough') {
      if (this.courseStage.hasSourceWalkthrough) {
        this.activeTab = 'source_walkthrough';
      } else {
        this.activeTab = 'community_solutions';
      }
    } else if (this.args.intent === 'view_comments') {
      this.activeTab = 'comments';
    }
  }

  emitAnalyticsEvent() {
    if (this.activeTab === 'source_walkthrough') {
      this.store
        .createRecord('analytics-event', {
          name: 'viewed_course_stage_source_walkthrough',
          properties: {
            course_slug: this.courseStage.course.slug,
            course_stage_slug: this.courseStage.slug,
          },
        })
        .save();
    }
  }

  @action
  handleCourseStageUpdated() {
    if (!this.tabIsAvailableForCourseStage(this.activeTab)) {
      this.activeTab = 'community_solutions';
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
  async handleNextStageButtonClick() {
    this.courseStage = this.courseStage.nextStage;
    this.handleCourseStageUpdated();
  }

  @action
  async handlePreviousStageButtonClick() {
    this.courseStage = this.courseStage.previousStage;
    this.handleCourseStageUpdated();
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
    return this.courseStage.solutions.findBy('language', this.requestedSolutionLanguage);
  }
}
