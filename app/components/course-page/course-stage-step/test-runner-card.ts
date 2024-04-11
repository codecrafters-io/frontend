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
    onExpand?: () => void; // Overrides the default expand action if passed in
    repository: RepositoryModel;
    stage: CourseStageModel;
  };
};

export default class TestRunnerCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;

  @tracked isExpanded = false;

  get isCollapsed() {
    return !this.isExpanded;
  }

  @action
  handleCollapseButtonClick() {
    next(() => {
      this.isExpanded = false;
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
      this.isExpanded = true;
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
