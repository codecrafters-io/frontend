import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isCircle?: boolean;
  };
}

export default class LoadingSkeleton extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LoadingSkeleton: typeof LoadingSkeleton;
  }
}
