import Component from '@glimmer/component';
import window from 'ember-window-mock';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { service } from '@ember/service';
import { Step } from 'codecrafters-frontend/utils/course-page-step-list';
import { tracked } from '@glimmer/tracking';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    activeStep: Step;
    currentStep: Step;
    repository: RepositoryModel;
  };
};

export default class TestResultsBarComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare authenticator: AuthenticatorService;
  @tracked activeTabSlug = 'logs'; // 'logs' | 'autofix'
  @tracked customHeight = htmlSafe('height: 50vh');

  get availableTabSlugs() {
    if (this.args.activeStep.type === 'CourseStageStep') {
      const courseStageStep = this.args.activeStep as CourseStageStep;

      if (courseStageStep.courseStage.isFirst) {
        return ['logs'];
      } else if (courseStageStep.courseStage.isSecond) {
        return ['logs', 'autofix'];
      } else {
        if (this.authenticator.currentUser?.isStaff) {
          return ['logs', 'autofix'];
        } else {
          return ['logs'];
        }
      }
    } else {
      return ['logs'];
    }
  }

  get isCollapsed() {
    return !this.isExpanded;
  }

  get isExpanded() {
    return this.coursePageState.testResultsBarIsExpanded;
  }

  @action
  handleCollapseButtonClick() {
    this.coursePageState.testResultsBarIsExpanded = false;
  }

  @action
  handleExpandButtonClick() {
    this.coursePageState.testResultsBarIsExpanded = true;
  }

  @action
  handleResize(event: MouseEvent) {
    const newHeight = window.innerHeight - event.clientY;
    this.customHeight = htmlSafe(`height: ${newHeight}px`);
  }

  @action
  startResize(event: MouseEvent) {
    event.preventDefault();

    document.addEventListener('mousemove', this.handleResize);
    document.addEventListener('mouseup', this.stopResize);
  }

  @action
  stopResize() {
    document.removeEventListener('mousemove', this.handleResize);
    document.removeEventListener('mouseup', this.stopResize);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar': typeof TestResultsBarComponent;
  }
}
