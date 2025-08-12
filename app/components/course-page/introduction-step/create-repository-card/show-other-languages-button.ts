import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;
}

export default class ShowOtherLanguagesButton extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::CreateRepositoryCard::ShowOtherLanguagesButton': typeof ShowOtherLanguagesButton;
  }
}
