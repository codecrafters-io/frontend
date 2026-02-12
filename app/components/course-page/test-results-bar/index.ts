import Component from '@glimmer/component';
import window from 'ember-window-mock';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { service } from '@ember/service';
import { StepDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import { tracked } from '@glimmer/tracking';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import fade from 'ember-animated/transitions/fade';
import type AutofixRequestModel from 'codecrafters-frontend/models/autofix-request';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    activeStep: StepDefinition;
    currentStep: StepDefinition;
    repository: RepositoryModel;
  };
}

interface ScreenService {
  width: number;
}

export default class TestResultsBar extends Component<Signature> {
  transition = fade;

  @service declare authenticator: AuthenticatorService;
  @service declare coursePageState: CoursePageStateService;
  @service declare screen: ScreenService;

  @tracked activeTabSlugForLeftPane = 'logs'; // 'logs' | 'autofix'
  @tracked activeTabSlugForRightPane = 'autofix';
  @tracked bottomSectionElement: HTMLDivElement | null = null;
  @tracked expandedContainerHeight = '75vh';
  @tracked isResizing = false;

  get autofixRequestForActiveStep(): AutofixRequestModel | null {
    if (this.args.activeStep.type !== 'CourseStageStep') {
      return null;
    }

    const courseStageStep = this.args.activeStep as CourseStageStep;

    return (
      (this.args.repository.lastSubmission?.autofixRequests || [])
        .filter((request) => !request.creatorTypeIsStaffOrInternal)
        .filter((request) => request.submission === this.args.repository.lastSubmission)
        .filter((request) => request.submission.courseStage === courseStageStep.courseStage)
        .at(-1) || null
    );
  }

  get availableTabSlugs() {
    if (this.args.activeStep.type === 'CourseStageStep') {
      const courseStageStep = this.args.activeStep as CourseStageStep;

      if (courseStageStep.courseStage.isFirst) {
        return ['logs'];
      } else {
        if (this.autofixRequestForActiveStep) {
          return ['logs', 'autofix'];
        } else {
          return ['logs'];
        }
      }
    } else {
      return ['logs'];
    }
  }

  get availableTabSlugsForLeftPane() {
    return this.availableTabSlugs.filter((slug) => !this.availableTabSlugsForRightPane.includes(slug));
  }

  get availableTabSlugsForRightPane() {
    if (this.screen.width > 1024 && this.availableTabSlugs.length > 1) {
      return ['autofix'];
    } else {
      return [];
    }
  }

  get expandedContainerStyle() {
    if (this.isExpanded) {
      return htmlSafe(`height: ${this.expandedContainerHeight}`);
    } else {
      return htmlSafe('height: 0px');
    }
  }

  get isCollapsed() {
    return !this.isExpanded;
  }

  get isExpanded() {
    return this.coursePageState.testResultsBarIsExpanded;
  }

  get shouldShowRightPane() {
    return this.availableTabSlugsForRightPane.length > 0;
  }

  @action
  handleCollapseButtonClick() {
    this.coursePageState.testResultsBarIsExpanded = false;
  }

  @action
  handleDidInsertBottomSectionElement(element: HTMLDivElement) {
    this.bottomSectionElement = element;
  }

  @action
  handleExpandButtonClick() {
    this.coursePageState.testResultsBarIsExpanded = true;
  }

  @action
  handleMouseResize(event: MouseEvent) {
    const newHeight = window.innerHeight - event.clientY - (this.bottomSectionElement?.offsetHeight || 0);
    this.expandedContainerHeight = `max(200px, min(calc(100vh - 50px), ${newHeight}px))`;
  }

  @action
  handleTouchResize(event: TouchEvent) {
    const touch = event.touches[0] as Touch;
    const newHeight = window.innerHeight - touch.clientY - (this.bottomSectionElement?.offsetHeight || 0);
    this.expandedContainerHeight = `max(200px, min(calc(100vh - 50px), ${newHeight}px))`;
  }

  @action
  startMouseResize(event: MouseEvent) {
    // Trigger mouse resize on left click only
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();

    this.isResizing = true;
    document.addEventListener('mousemove', this.handleMouseResize);
    document.addEventListener('mouseup', this.stopMouseResize);
  }

  @action
  startTouchResize(event: TouchEvent) {
    event.preventDefault();

    this.isResizing = true;

    document.addEventListener('touchmove', this.handleTouchResize);
    document.addEventListener('touchend', this.stopTouchResize);
  }

  @action
  stopMouseResize() {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.handleMouseResize);
    document.removeEventListener('mouseup', this.stopMouseResize);
  }

  @action
  stopTouchResize() {
    this.isResizing = false;
    document.removeEventListener('touchmove', this.handleTouchResize);
    document.removeEventListener('touchend', this.stopTouchResize);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar': typeof TestResultsBar;
  }
}
