import { cached, tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import InterviewMilestone from 'codecrafters-frontend/utils/interview-milestone';
import congratulationsImage from '/assets/images/icons/congratulations.png';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseExtensionModel from 'codecrafters-frontend/models/course-extension';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    extension: CourseExtensionModel;
  };
}

export default class ExtensionCompletedCard extends Component<Signature> {
  congratulationsImage = congratulationsImage;

  @tracked configureExtensionsModalIsOpen = false;

  @cached
  get interviewMilestone() {
    return InterviewMilestone.forExtension(this.args.repository, this.args.extension);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ExtensionCompletedCard': typeof ExtensionCompletedCard;
  }
}
