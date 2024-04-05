import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    color: 'gray' | 'green' | 'red' | 'yellow';
    size?: 'regular' | 'large';
  };
}

export default class StaticDotComponent extends Component<Signature> {
  get sizeClasses() {
    return {
      regular: 'w-2.5 h-2.5',
      large: 'w-3.5 h-3.5',
    }[this.args.size || 'regular'];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    StaticDot: typeof StaticDotComponent;
  }
}
