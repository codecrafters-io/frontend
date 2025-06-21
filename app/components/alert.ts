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
      green: 'bg-green-100/40 dark:bg-green-900/20 border-green-500/60 dark:border-green-500/40',
      blue: 'bg-blue-100/40 dark:bg-blue-900/20 border-blue-500/60 dark:border-blue-500/40',
      red: 'bg-red-100/40 dark:bg-red-900/20 border-red-500/60 dark:border-red-500/40',
    }[this.args.color];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Alert: typeof AlertComponent;
  }
}
