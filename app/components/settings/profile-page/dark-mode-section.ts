import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;
}

export default class DarkModeSectionComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::ProfilePage::DarkModeSection': typeof DarkModeSectionComponent;
  }
}
