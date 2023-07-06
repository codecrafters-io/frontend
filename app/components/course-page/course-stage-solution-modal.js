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
  @tracked activeTab; // community_solutions/verified_solution/comments
  @tracked courseStage;
  @tracked requestedSolutionLanguage;

  @service analyticsEventTracker;
  @service featureFlags;
  @service store;

  constructor() {
    super(...arguments);

    this.courseStage = this.args.courseStage;
    this.computeActiveTabFromIntent();
    this.emitAnalyticsEvent();
  }

  get availableTabs() {
    return ['comments', 'community_solutions', 'verified_solution', 'screencasts'].filter((tab) => this.tabIsAvailable(tab));
  }

  tabIsAvailable(tab) {
    if (this.courseStage.isFirst) {
      return ['verified_solution', 'comments'].includes(tab);
    }

    if (tab === 'verified_solution') {
      return false;
    } else if (tab === 'screencasts') {
      return this.featureFlags.canSeeScreencasts && this.courseStage.hasScreencasts;
    } else {
      return true;
    }
  }

  emitAnalyticsEvent() {
    if (this.activeTab === 'comments') {
      this.analyticsEventTracker.track('viewed_course_stage_comments', {
        course_slug: this.courseStage.course.slug,
        course_stage_slug: this.courseStage.slug,
      });
    } else if (this.activeTab === 'screencasts') {
      this.analyticsEventTracker.track('viewed_screencast_list', { course_stage_id: this.courseStage.id });
    }
  }

  @action
  handleCourseStageUpdated() {
    if (!this.tabIsAvailable(this.activeTab)) {
      this.activeTab = this.availableTabs[0];
    }
  }

  @action
  handleDidInsertLanguageDropdown(dd) {
    if (dd) {
      this.languageDropdown = dd; // This is called with null when the dropdown is destroyed, and we use it for two different dropdowns
    }
  }

  @action
  async handleNextStageButtonClick() {
    if (this.courseStage.nextStage) {
      this.courseStage = this.courseStage.nextStage;
      this.handleCourseStageUpdated();
    }
  }

  @action
  async handlePreviousStageButtonClick() {
    if (this.courseStage.previousStage) {
      this.courseStage = this.courseStage.previousStage;
      this.handleCourseStageUpdated();
    }
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
