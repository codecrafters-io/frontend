import Component from '@glimmer/component';
import type { CommunitySolutionsAnalysisStatistic } from 'codecrafters-frontend/models/community-solutions-analysis';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    statistic?: CommunitySolutionsAnalysisStatistic;
    fallbackLabel?: string;
  };
}

export default class StatisticComponent extends Component<Signature> {
  get valueColorClasses(): string {
    if (!this.args.statistic) {
      return 'text-gray-500';
    }

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
    'CourseAdmin::CodeExampleInsightsIndexPage::StageListItem::Statistic': typeof StatisticComponent;
  }
}
