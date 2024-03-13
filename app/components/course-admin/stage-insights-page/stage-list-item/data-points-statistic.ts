import Component from '@glimmer/component';
import CourseStageParticipationAnalysisModel from 'codecrafters-frontend/models/course-stage-participation-analysis';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    participationAnalysis: CourseStageParticipationAnalysisModel | null;
  };
};

export default class DataPointsStatisticComponent extends Component<Signature> {
  get statistic(): CourseStageParticipationAnalysisModel['participationCountsStatistic'] {
    if (this.args.participationAnalysis) {
      return this.args.participationAnalysis.participationCountsStatistic;
    } else {
      return CourseStageParticipationAnalysisModel.nullParticipationCountsStatistic;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::StageInsightsPage::StageListItem::DataPointsStatistic': typeof DataPointsStatisticComponent;
  }
}
