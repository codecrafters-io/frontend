import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type CourseStageParticipationAnalysisModel from 'codecrafters-frontend/models/course-stage-participation-analysis';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    stage: CourseStageModel;
  };
};

export default class StageListItemComponent extends Component<Signature> {
  get participationAnalysis(): CourseStageParticipationAnalysisModel | null {
    return this.args.stage.participationAnalyses[0] || null;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::StageInsightsPage::StageListItem': typeof StageListItemComponent;
  }
}
