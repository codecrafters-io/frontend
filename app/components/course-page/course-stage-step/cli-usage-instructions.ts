import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    courseStage: CourseStageModel;
  };
};

export default class CliUsageInstructionsComponent extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

  @action
  handleClick() {
    this.analyticsEventTracker.track('clicked_cli_installation_link', {
      course_stage_id: this.args.courseStage.id,
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CliUsageInstructions': typeof CliUsageInstructionsComponent;
  }
}
