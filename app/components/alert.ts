import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    type?: 'success' | 'info' | 'error';
    icon?: string;
  };

  Blocks: {
    default: [];
  };
}

export default class AlertComponent extends Component<Signature> {
  get containerColorClasses(): string {
    return {
      success: 'bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-900 dark:bg-opacity-40',
      info: 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-900 dark:bg-opacity-40',
      error: 'bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-900 dark:bg-opacity-40',
    }[this.type];
  }

  get icon(): string {
    return this.args.icon || 'information-circle';
  }

  get iconColorClasses(): string {
    return {
      success: 'text-green-400',
      info: 'text-blue-400 dark:text-blue-500',
      error: 'text-red-400 dark:text-red-500',
    }[this.type];
  }

  get textColorClasses(): string {
    return {
      success: 'text-green-800 prose-green',
      info: 'prose-blue',
      error: 'text-red-800 prose-red',
    }[this.type];
  }

  get type(): 'success' | 'info' | 'error' {
    return this.args.type || 'info';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Alert: typeof AlertComponent;
  }
}
