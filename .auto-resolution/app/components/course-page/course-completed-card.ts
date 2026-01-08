import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import congratulationsImage from '/assets/images/icons/congratulations.png';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
}

export default class CourseCompletedCard extends Component<Signature> {
  congratulationsImage = congratulationsImage;

  @tracked configureGithubIntegrationModalIsOpen = false;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseCompletedCard': typeof CourseCompletedCard;
  }
}
