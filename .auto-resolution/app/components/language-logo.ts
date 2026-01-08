import Component from '@glimmer/component';
import LanguageModel from 'codecrafters-frontend/models/language';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    language: LanguageModel;
    variant: 'color' | 'gray' | 'teal';
  };
}

export default class LanguageLogo extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LanguageLogo: typeof LanguageLogo;
  }
}
