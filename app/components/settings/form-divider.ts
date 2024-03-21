import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;
}

export default class FormDividerComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::FormDivider': typeof FormDividerComponent;
  }
}
