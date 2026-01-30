import Component from '@glimmer/component';
import type { CourseStageParticipationAnalysisStatistic } from 'codecrafters-frontend/models/course-stage-participation-analysis';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    statistic: CourseStageParticipationAnalysisStatistic;
  };
}

export default class StatisticCard extends Component<Signature> {
  get valueColorClasses(): string {
    return {
      green: 'text-teal-500 dark:text-teal-400',
      yellow: 'text-yellow-500 dark:text-yellow-400',
      red: 'text-red-500 dark:text-red-400',
      gray: 'text-gray-500 dark:text-gray-400',
    }[this.args.statistic.color];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::StageInsightsPage::StatisticCard': typeof StatisticCard;
  }
}
