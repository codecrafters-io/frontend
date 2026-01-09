import { action } from '@ember/object';
import type Owner from '@ember/owner';
import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    color: 'blue' | 'green' | 'red' | 'teal' | 'yellow';
    size?: 'regular' | 'large';
    isInteractive?: boolean;
    isDismissable?: boolean;
    onDismiss?: () => void;
  };

  Blocks: {
    default: [];
  };
}

export default class Alert extends Component<Signature> {
  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args);

    if (args.isDismissable && !args.onDismiss) {
      throw new Error('Alert: @onDismiss is required when @isDismissable is true');
    }
  }

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

  get dismissButtonColorClasses(): string {
    return {
      green: 'border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800/50 text-green-500',
      blue: 'border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-500',
      red: 'border-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-500',
      teal: 'border-teal-300 dark:border-teal-700 hover:bg-teal-200 dark:hover:bg-teal-800/50 text-teal-500',
      yellow: 'border-yellow-300 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-800/50 text-yellow-500',
    }[this.args.color];
  }

  get sizeIsLarge(): boolean {
    return this.args.size === 'large';
  }

  get sizeIsRegular(): boolean {
    return this.args.size === 'regular' || !this.args.size;
  }

  @action
  handleDismissButtonClick() {
    this.args.onDismiss?.();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Alert: typeof Alert;
  }
}
