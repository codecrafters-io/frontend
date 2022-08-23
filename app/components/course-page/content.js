import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class CoursePageContentComponent extends Component {
  @tracked currentCourseStageForSolution;
  @tracked currentCourseStageForSourceWalkthrough;
  @service('current-user') currentUserService;
  @service router;

  get currentUser() {
    return this.currentUserService.record;
  }

  @action
  async handleViewSourceWalkthroughButtonClick(courseStage) {
    if (courseStage.solutionIsAccessibleToMembersOnly && !this.currentUser.canAccessPaidContent) {
      this.router.transitionTo('pay');
    } else {
      this.currentCourseStageForSolution = null;
      this.currentCourseStageForSourceWalkthrough = courseStage;
    }
  }

  @action
  async handleViewSolutionButtonClick(courseStage) {
    if (courseStage.solutionIsAccessibleToMembersOnly && !this.currentUser.canAccessPaidContent) {
      this.router.transitionTo('pay');
    } else {
      this.currentCourseStageForSourceWalkthrough = null;
      this.currentCourseStageForSolution = courseStage;
    }
  }

  @action
  async handleCourseStageSolutionModalClose() {
    this.currentCourseStageForSolution = null;
    this.currentCourseStageForSourceWalkthrough = null;
  }

  get isViewingCourseStageSolution() {
    return !!this.currentCourseStageForSolution;
  }

  get isViewingCourseStageSourceWalkthrough() {
    return !!this.currentCourseStageForSourceWalkthrough;
  }

  get visiblePrivateLeaderboardFeatureSuggestion() {
    if (this.currentUserService.isAnonymous || this.currentUser.isTeamMember) {
      return null;
    }

    return this.currentUser.featureSuggestions.filterBy('featureIsPrivateLeaderboard').rejectBy('isDismissed').firstObject;
  }
}
