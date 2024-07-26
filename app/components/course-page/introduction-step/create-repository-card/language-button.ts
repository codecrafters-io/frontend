import Component from '@glimmer/component';
import type LanguageModel from 'codecrafters-frontend/models/language';

export interface Signature {
  Element: HTMLButtonElement;

  Args: {
    isSelected: boolean;
    language: LanguageModel;
    releaseStatusIsAlpha: boolean;
  };
}

export default class LanguageButtonComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::CreateRepositoryCard::LanguageButton': typeof LanguageButtonComponent;
  }
}
