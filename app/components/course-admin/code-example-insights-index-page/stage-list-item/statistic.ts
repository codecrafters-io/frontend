import Component from '@glimmer/component';
import type { CommunitySolutionsAnalysisStatistic } from 'codecrafters-frontend/models/community-solutions-analysis';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    fallbackLabel?: string;
    statistic?: CommunitySolutionsAnalysisStatistic;
  };
}

export default class Statistic extends Component<Signature> {
  get valueColorClasses(): string {
    if (!this.args.statistic) {
      return 'text-gray-500 dark:text-gray-400';
    }

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
    'CourseAdmin::CodeExampleInsightsIndexPage::StageListItem::Statistic': typeof Statistic;
  }
}
