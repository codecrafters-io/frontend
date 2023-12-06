import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { Step } from 'codecrafters-frontend/lib/course-page-step-list';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';

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
  @tracked activeTabSlug = 'logs'; // 'logs' | 'autofix'

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
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar': typeof TestResultsBarComponent;
  }
}
