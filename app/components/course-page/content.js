import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class CoursePageContentComponent extends Component {
  @tracked currentCourseStageForSolution;
  @service('current-user') currentUserService;

  get currentUser() {
    return this.currentUserService.record;
  }

  @action
  async handleViewSolutionButtonClick(courseStage) {
    this.currentCourseStageForSolution = courseStage;
  }

  @action
  async handleCourseStageSolutionModalClose() {
    this.currentCourseStageForSolution = null;
  }

  get isViewingCourseStageSolution() {
    return !!this.currentCourseStageForSolution;
  }

  get visiblePrivateLeaderboardFeatureSuggestion() {
    if (this.currentUserService.isAnonymous || this.currentUser.isTeamMember) {
      return null;
    }

    return this.currentUser.featureSuggestions.filterBy('featureIsPrivateLeaderboard').rejectBy('isDismissed').firstObject;
  }
}
