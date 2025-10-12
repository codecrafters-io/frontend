import Component from '@glimmer/component';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type CourseModel from 'codecrafters-frontend/models/course';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
    requestedAndUnsupportedLanguages: LanguageModel[];
  };
}

export default class RequestedLanguagesPrompt extends Component<Signature> {
  get willLetYouKnowText() {
    return `We'll let you know once ${this.args.requestedAndUnsupportedLanguages.map((item) => item.name).join(' / ')} support is available on this challenge.`;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::CreateRepositoryCard::RequestedLanguagesPrompt': typeof RequestedLanguagesPrompt;
  }
}
