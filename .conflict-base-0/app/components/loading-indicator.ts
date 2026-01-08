import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;
};

export default class LoadingIndicator extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LoadingIndicator: typeof LoadingIndicator;
  }
}
