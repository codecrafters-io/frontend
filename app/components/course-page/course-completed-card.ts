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

export default class CourseCompletedCardComponent extends Component<Signature> {
  congratulationsImage = congratulationsImage;

  @tracked configureGithubIntegrationModalIsOpen = false;

  get shouldRenderDefaultCompletionMessage() {
    // The default message has frontend features that are not supported in markdown
    // Specifically, the github link to publish repo
    return this.args.repository.course.completionMessageMarkdown === "Congratulations! You've completed all stages of this course. 🎉";
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseCompletedCard': typeof CourseCompletedCardComponent;
  }
}
