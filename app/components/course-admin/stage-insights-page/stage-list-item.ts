import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    stage: CourseStageModel;
  };
};

export default class StageListItemComponent extends Component<Signature> {
  get courseStageParticipationsCount() {
    if (this.args.stage.position <= 3) {
      return 204;
    } else {
      return 85;
    }
  }

  get courseStageParticipationsCountMeetsThreshold() {
    return this.courseStageParticipationsCount > 100;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::StageInsightsPage::StageListItem': typeof StageListItemComponent;
  }
}
