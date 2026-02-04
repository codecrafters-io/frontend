import Component from '@glimmer/component';
import type LanguageModel from 'codecrafters-frontend/models/language';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isCurrent: boolean;
    isEnabled: boolean;
    isRequested: boolean;
    language: LanguageModel;
    onClick: (event: MouseEvent) => void;
  };
}

export default class SolutionLanguageDropdownLink extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SolutionLanguageDropdownLink': typeof SolutionLanguageDropdownLink;
  }
}
