import Component from '@glimmer/component';
import CourseStageParticipationAnalysisModel from 'codecrafters-frontend/models/course-stage-participation-analysis';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    participationAnalysis: CourseStageParticipationAnalysisModel | null;
  };
};

export default class CompletionRateStatisticComponent extends Component<Signature> {
  get statistic(): CourseStageParticipationAnalysisModel['completionRateStatistic'] {
    if (this.args.participationAnalysis) {
      return this.args.participationAnalysis.completionRateStatistic;
    } else {
      return CourseStageParticipationAnalysisModel.nullCompletionRateStatistic;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::StageInsightsPage::StageListItem::CompletionRateStatistic': typeof CompletionRateStatisticComponent;
  }
}
