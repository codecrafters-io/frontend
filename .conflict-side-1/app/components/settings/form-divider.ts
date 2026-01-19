import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;
}

export default class FormDivider extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::FormDivider': typeof FormDivider;
  }
}
