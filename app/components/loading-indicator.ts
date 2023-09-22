import Component from '@glimmer/component';

export default class LoadingIndicatorComponent extends Component {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LoadingIndicator: typeof LoadingIndicatorComponent;
  }
}
