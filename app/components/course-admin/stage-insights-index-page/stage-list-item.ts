import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import CourseStageParticipationAnalysisModel from 'codecrafters-frontend/models/course-stage-participation-analysis';

type Signature = {
  Element: HTMLAnchorElement;

  Args: {
    stage: CourseStageModel;
  };
};

export default class StageListItemComponent extends Component<Signature> {
  get completionRateStatistic() {
    if (this.participationAnalysis) {
      return this.participationAnalysis.completionRateStatistic;
    } else {
      return CourseStageParticipationAnalysisModel.nullCompletionRateStatistic;
    }
  }

  get dataPointsStatistic() {
    if (this.participationAnalysis) {
      return this.participationAnalysis.participationsCountStatistic;
    } else {
      return CourseStageParticipationAnalysisModel.nullParticipationsCountStatistic;
    }
  }

  get medianAttemptsCountStatistic() {
    if (this.participationAnalysis) {
      return this.participationAnalysis.medianAttemptsCountStatistic;
    } else {
      return CourseStageParticipationAnalysisModel.nullMedianAttemptsCountStatistic;
    }
  }

  get participationAnalysis() {
    return this.args.stage.participationAnalyses[0] || null;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::StageInsightsIndexPage::StageListItem': typeof StageListItemComponent;
  }
}
