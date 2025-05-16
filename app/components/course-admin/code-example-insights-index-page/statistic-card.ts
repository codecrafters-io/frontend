import Component from '@glimmer/component';
import type { CommunitySolutionsAnalysisStatistic } from 'codecrafters-frontend/models/community-solutions-analysis';

interface StatisticCardArgs {
  statistic: CommunitySolutionsAnalysisStatistic;
}

export default class StatisticCardComponent extends Component<StatisticCardArgs> {
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
    'CourseAdmin::CodeExampleInsightsIndexPage::StatisticCard': typeof StatisticCardComponent;
  }
}
