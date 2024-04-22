import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    isCollapsible: boolean;
    onExpand?: () => void; // Overrides the default expand action if passed in
    repository: RepositoryModel;
    stage: CourseStageModel;
  };
};

export default class TestRunnerCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;

  @tracked wasExpandedByUser = false;

  get backgroundColorClasses() {
    if (this.isExpanded) {
      return {
        passed: 'bg-teal-50',
        failed: 'bg-white',
        evaluating: 'bg-yellow-50',
        error_or_not_run: 'bg-white',
      }[this.testsStatus];
    } else {
      return {
        passed: 'bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100',
        failed: 'bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100',
        evaluating: 'bg-gradient-to-b from-white to-yellow-50 hover:from-yellow-50 hover:to-yellow-100',
        error_or_not_run: 'bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100',
      }[this.testsStatus];
    }
  }

  get borderColorClasses() {
    return {
      passed: 'border-teal-500',
      failed: 'border-gray-300',
      evaluating: 'border-yellow-500',
      error_or_not_run: 'border-gray-300',
    }[this.testsStatus];
  }

  get headerTextColorClasses() {
    return {
      passed: 'text-teal-500',
      failed: 'text-gray-400',
      evaluating: 'text-yellow-500',
      error_or_not_run: 'text-gray-400',
    }[this.testsStatus];
  }

  get isCollapsed() {
    return !this.isExpanded;
  }

  get isExpanded() {
    return this.wasExpandedByUser || !this.args.isCollapsible;
  }

  get testsStatus() {
    return this.coursePageState.currentStepAsCourseStageStep.testsStatus;
  }

  @action
  handleCollapseButtonClick() {
    next(() => {
      this.wasExpandedByUser = false;
    });
  }

  @action
  handleExpandButtonClick() {
    // If onExpand is passed in, bypass the default
    if (this.args.onExpand) {
      this.args.onExpand();

      return;
    }

    next(() => {
      this.wasExpandedByUser = true;
    });
  }

  @action
  handleViewLogsButtonClick() {
    this.coursePageState.testResultsBarIsExpanded = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::TestRunnerCard': typeof TestRunnerCardComponent;
  }
}
