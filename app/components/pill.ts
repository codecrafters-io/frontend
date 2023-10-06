import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    color: 'green' | 'yellow' | 'red' | 'blue';
  };

  Blocks: {
    default: [];
  };
};

export default class PillComponent extends Component<Signature> {
  get colorClasses() {
    return {
      green: 'bg-green-50 text-green-700 ring-green-600/20',
      yellow: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
      red: 'bg-red-50 text-red-700 ring-red-600/20',
      blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    }[this.args.color];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Pill: typeof PillComponent;
  }
}
