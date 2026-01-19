import Component from '@glimmer/component';
import CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    courseStage: CourseStageModel;
    solutions: CommunityCourseStageSolutionModel[];
    stageIncompleteModalWasDismissed: boolean;
    repository: RepositoryModel;
  };
}

export default class CommunitySolutionsList extends Component<Signature> {
  rippleSpinnerImage = rippleSpinnerImage;

  @service declare authenticator: AuthenticatorService;
  @service declare coursePageState: CoursePageStateService;

  @tracked configureGithubIntegrationModalIsOpen = false;
  @tracked expandedSolution: CommunityCourseStageSolutionModel | null = null;

  get accessibleSolutions() {
    if (this.shouldShowInaccessibleSolutionsList) {
      return this.args.solutions.slice(0, 2);
    }

    return this.args.solutions;
  }

  get inaccessibleSolutions() {
    if (this.shouldShowInaccessibleSolutionsList) {
      return this.args.solutions.slice(2);
    }

    return [];
  }

  get shouldShowInaccessibleSolutionsList() {
    return (
      this.authenticator.currentUser &&
      !this.authenticator.currentUser.canAccessMembershipBenefits &&
      this.args.solutions.length >= 5 &&
      this.args.courseStage.positionWithinCourse > 2 // Don't interfere with stage 1 & 2 onboarding
    );
  }

  get shouldShowStageIncompleteModal() {
    return (
      !this.args.stageIncompleteModalWasDismissed &&
      this.coursePageState.currentStep.type === 'CourseStageStep' &&
      !(this.coursePageState.currentStep as CourseStageStep).courseStage.isFirst &&
      !(this.coursePageState.currentStep as CourseStageStep).courseStage.isSecond &&
      this.args.solutions.length > 0 &&
      this.coursePageState.currentStep.status !== 'complete' &&
      (this.coursePageState.currentStep as CourseStageStep).testsStatus !== 'passed'
    );
  }

  @action
  handleDidInsert() {
    this.expandedSolution ||= this.accessibleSolutions[0] || null;
  }

  @action
  handleSolutionCollapseButtonClick(_solution: CommunityCourseStageSolutionModel, _solutionIndex: number, containerElement: HTMLDivElement) {
    this.expandedSolution = null;

    next(() => {
      containerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
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
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionsList': typeof CommunitySolutionsList;
  }
}
