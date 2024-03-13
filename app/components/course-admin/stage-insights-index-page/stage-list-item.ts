import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

type Signature = {
  Element: HTMLAnchorElement;

  Args: {
    stage: CourseStageModel;
  };
};

export default class StageListItemComponent extends Component<Signature> {
  get participationAnalysis() {
    return this.args.stage.participationAnalyses[0]!;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::StageInsightsIndexPage::StageListItem': typeof StageListItemComponent;
  }
}
