import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;
};

export default class LoadingIndicatorComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LoadingIndicator: typeof LoadingIndicatorComponent;
  }
}
