import Component from '@glimmer/component';
import LanguageModel from 'codecrafters-frontend/models/language';
import RepositoryModel from 'codecrafters-frontend/models/repository';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    language: LanguageModel;
    repository: RepositoryModel;
    onClick: () => void;
    isCurrent: boolean;
    isRequested: boolean;
    isEnabled: boolean;
  };
}

export default class CoursePageSolutionLanguageDropdownLink extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SolutionLanguageDropdownLink': typeof CoursePageSolutionLanguageDropdownLink;
  }
}
