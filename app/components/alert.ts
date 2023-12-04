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
      success: 'bg-green-100 border-green-300',
      info: 'bg-blue-100 border-blue-300',
      error: 'bg-red-100 border-red-300',
    }[this.type];
  }

  get icon(): string {
    return this.args.icon || 'information-circle';
  }

  get iconColorClasses(): string {
    return {
      success: 'text-green-400',
      info: 'text-blue-400',
      error: 'text-red-400',
    }[this.type];
  }

  get textColorClasses(): string {
    return {
      success: 'text-green-800 prose-green',
      info: 'text-blue-900 prose-blue',
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
