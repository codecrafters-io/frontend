import { action } from '@ember/object';
import { next } from '@ember/runloop';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { Step } from 'codecrafters-frontend/lib/course-page-step-list';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    activeStep: Step;
    repository: RepositoryModel;
  };
};

export default class TestResultsBarComponent extends Component<Signature> {
  @tracked isExpanded = false;

  get isCollapsed() {
    return !this.isExpanded;
  }

  @action
  handleCollapseButtonClick() {
    // Avoid conflict with handleCollapsedBarClick
    next(() => {
      this.isExpanded = false;
    });
  }

  @action
  handleExpandButtonClick() {
    if (this.isCollapsed) {
      this.isExpanded = true;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar': typeof TestResultsBarComponent;
  }
}
