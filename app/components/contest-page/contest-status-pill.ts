import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    color: 'gray' | 'green';
    tooltipCopy?: string;
  };

  Blocks: {
    default: [];
  };
}

export default class ContestStatusPillComponent extends Component<Signature> {
  get contestStatusPillColorClasses(): string {
    return {
      green: 'border-green-500 text-green-500',
      gray: 'border-gray-600 text-gray-600',
    }[this.args.color];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ContestPage::ContestStatusPill': typeof ContestStatusPillComponent;
  }
}
