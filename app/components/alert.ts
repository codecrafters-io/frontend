import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    color: 'green' | 'blue' | 'red';
  };

  Blocks: {
    default: [];
  };
}

export default class AlertComponent extends Component<Signature> {
  get containerColorClasses(): string {
    return {
      green: 'bg-green-100 bg-opacity-40 border-green-300 dark:bg-green-900 dark:border-green-900',
      blue: 'bg-blue-100 bg-opacity-40 border-blue-300 dark:bg-blue-900 dark:border-blue-900',
      red: 'bg-red-100 bg-opacity-40 border-red-300 dark:bg-red-900 dark:border-red-900',
    }[this.args.color];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Alert: typeof AlertComponent;
  }
}
