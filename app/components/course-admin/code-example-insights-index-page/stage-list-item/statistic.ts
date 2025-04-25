import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    color: 'green' | 'yellow' | 'red' | 'gray';
    label: string;
    value: number | null;
  };
}

export default class StatisticComponent extends Component<Signature> {
  get valueColorClasses(): string {
    return {
      green: 'text-teal-500',
      yellow: 'text-yellow-500',
      red: 'text-red-500',
      gray: 'text-gray-500',
    }[this.args.color];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExampleInsightsIndexPage::StageListItem::Statistic': typeof StatisticComponent;
  }
}
