import Component from '@glimmer/component';
import type LanguageModel from 'codecrafters-frontend/models/language';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    requestedAndUnsupportedLanguages: LanguageModel[];
  };
}

export default class RequestedLanguagesPromptComponent extends Component<Signature> {
  get willLetYouKnowText() {
    return `We'll let you know once ${this.args.requestedAndUnsupportedLanguages.mapBy('name').join(' / ')} support is available on this challenge.`;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::Legacy::CreateRepositoryCard::RequestedLanguagesPrompt': typeof RequestedLanguagesPromptComponent;
  }
}
