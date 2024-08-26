import Component from '@glimmer/component';
import type LanguageModel from 'codecrafters-frontend/models/language';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    language: LanguageModel;
    releaseStatusIsAlpha: boolean;
    isSelected: boolean;
  };
}

export default class LanguageButtonComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::CreateRepositoryCard::LanguageButton': typeof LanguageButtonComponent;
  }
}
