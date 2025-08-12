import Component from '@glimmer/component';
import { type CourseStageParticipationAnalysisStatistic } from 'codecrafters-frontend/models/course-stage-participation-analysis';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    statistic: CourseStageParticipationAnalysisStatistic;
  };
}

export default class Statistic extends Component<Signature> {
  get valueColorClasses(): string {
    return {
      green: 'text-teal-500',
      yellow: 'text-yellow-500',
      red: 'text-red-500',
      gray: 'text-gray-500',
    }[this.args.statistic.color];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::StageInsightsIndexPage::StageListItem::Statistic': typeof Statistic;
  }
}
