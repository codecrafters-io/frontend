import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    type?: 'success' | 'info' | 'error' | 'warning';
    icon?: string;
    isDismissable?: boolean;
    onDismiss?: () => void;
  };

  Blocks: {
    default: [];
  };
}

export default class AlertWithIcon extends Component<Signature> {
  get color(): 'green' | 'blue' | 'red' | 'yellow' {
    return {
      success: 'green',
      info: 'blue',
      error: 'red',
      warning: 'yellow',
    }[this.type] as 'green' | 'blue' | 'red' | 'yellow';
  }

  get icon(): string {
    return this.args.icon || 'information-circle';
  }

  get iconColorClasses(): string {
    return {
      success: 'text-green-500/80',
      info: 'text-blue-500/80',
      error: 'text-red-500/80',
      warning: 'text-yellow-500/80',
    }[this.type];
  }

  get proseColorClasses(): string {
    return {
      success: 'prose-green',
      info: 'prose-blue',
      error: 'prose-red',
      warning: 'prose-yellow',
    }[this.type];
  }

  get type(): 'success' | 'info' | 'error' | 'warning' {
    return this.args.type || 'info';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    AlertWithIcon: typeof AlertWithIcon;
  }
}
