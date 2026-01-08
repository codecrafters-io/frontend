import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    color: 'blue' | 'green' | 'red' | 'teal' | 'yellow';
    size?: 'regular' | 'large';
    isInteractive?: boolean;
  };

  Blocks: {
    default: [];
  };
}

export default class Alert extends Component<Signature> {
  get containerColorClasses(): string {
    return {
      green: 'bg-green-100/20 dark:bg-green-900/30 border-green-500/60 dark:border-green-500/40',
      blue: 'bg-blue-100/20 dark:bg-blue-900/30 border-blue-500/60 dark:border-blue-500/40',
      red: 'bg-red-100/20 dark:bg-red-900/30 border-red-500/60 dark:border-red-500/40',
      teal: 'bg-teal-100/20 dark:bg-teal-900/30 border-teal-500/60 dark:border-teal-500/40',
      yellow: 'bg-yellow-100/20 dark:bg-yellow-900/30 border-yellow-500/60 dark:border-yellow-500/40',
    }[this.args.color];
  }

  get containerInteractivityClasses(): string {
    if (!this.args.isInteractive) {
      return '';
    }

    return {
      green: 'hover:bg-green-100/40 dark:hover:bg-green-900/40',
      blue: 'hover:bg-blue-100/40 dark:hover:bg-blue-900/40',
      red: 'hover:bg-red-100/40 dark:hover:bg-red-900/40',
      teal: 'hover:bg-teal-100/40 dark:hover:bg-teal-900/40',
      yellow: 'hover:bg-yellow-100/40 dark:hover:bg-yellow-900/40',
    }[this.args.color];
  }

  get sizeIsLarge(): boolean {
    return this.args.size === 'large';
  }

  get sizeIsRegular(): boolean {
    return this.args.size === 'regular' || !this.args.size;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Alert: typeof Alert;
  }
}
