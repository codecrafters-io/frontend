import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isCollapsible: boolean;
    onExpand?: () => void; // Overrides the default expand action if passed in
    repository: RepositoryModel;
    stage: CourseStageModel;
  };
}

export default class TestRunnerCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;

  @tracked wasExpandedByUser = false;
  @tracked previousTestsStatus: string | null = null;

  get backgroundColorClasses() {
    if (this.isExpanded) {
      return {
        passed: 'bg-teal-50 dark:bg-teal-900/10',
        failed: 'bg-white dark:bg-gray-800/10',
        evaluating: 'bg-yellow-50 dark:bg-yellow-900/10',
        error_or_not_run: 'bg-white dark:bg-gray-800/10',
      }[this.testsStatus];
    } else {
      return {
        passed: 'bg-gradient-to-b from-white to-teal-50 hover:from-teal-50 hover:to-teal-100',
        failed:
          'bg-gradient-to-b from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/20 hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800/40 dark:hover:to-gray-800/50',
        evaluating: 'bg-gradient-to-b from-white to-yellow-50 dark:from-yellow-900/10 dark:to-yellow-900/20 hover:from-yellow-50 hover:to-yellow-100',
        error_or_not_run:
          'bg-gradient-to-b from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/20 hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800/40 dark:hover:to-gray-800/50',
      }[this.testsStatus];
    }
  }

  get borderColorClasses() {
    return {
      passed: 'border-teal-500 dark:border-teal-700/60',
      failed: 'border-gray-300 dark:border-gray-700/60',
      evaluating: 'border-yellow-500 dark:border-yellow-700/60',
      error_or_not_run: 'border-gray-300 dark:border-gray-700/60',
    }[this.testsStatus];
  }

  get headerTextColorClasses() {
    return {
      passed: 'text-teal-500 dark:text-teal-600',
      failed: 'text-gray-400 dark:text-gray-500',
      evaluating: 'text-yellow-500 dark:text-yellow-600',
      error_or_not_run: 'text-gray-400 dark:text-gray-500',
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
  handleDidUpdateTestsStatus(element: Signature['Element'], [newTestsStatus]: [CourseStageStep['testsStatus']]) {
    if (newTestsStatus === this.previousTestsStatus) {
      return;
    }

    if (newTestsStatus === 'evaluating') {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    this.previousTestsStatus = newTestsStatus;
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
