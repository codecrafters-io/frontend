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

export default class AlertWithIconComponent extends Component<Signature> {
  get color(): 'green' | 'blue' | 'red' {
    return {
      success: 'green',
      info: 'blue',
      error: 'red',
    }[this.type] as 'green' | 'blue' | 'red';
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

  get proseColorClasses(): string {
    return {
      success: 'prose-green',
      info: 'prose-blue',
      error: 'prose-red',
    }[this.type];
  }

  get type(): 'success' | 'info' | 'error' {
    return this.args.type || 'info';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    AlertWithIcon: typeof AlertWithIconComponent;
  }
}
