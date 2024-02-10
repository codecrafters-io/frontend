import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import congratulationsImage from '/assets/images/icons/congratulations.png';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseExtensionModel from 'codecrafters-frontend/models/course-extension';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    extension: CourseExtensionModel;
  };
};

export default class ExtensionCompletedCardComponent extends Component<Signature> {
  congratulationsImage = congratulationsImage;

  @tracked configureExtensionsModalIsOpen = false;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ExtensionCompletedCard': typeof ExtensionCompletedCardComponent;
  }
}
