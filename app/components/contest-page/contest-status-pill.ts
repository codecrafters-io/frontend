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
  get statusPillColorClasses(): string {
    return {
      green: 'border-green-300 text-green-700',
      gray: 'border-gray-300 text-gray-700',
    }[this.args.color];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ContestPage::ContestStatusPill': typeof ContestStatusPillComponent;
  }
}
