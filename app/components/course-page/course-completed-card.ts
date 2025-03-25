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
    // If there is no custom completion message set, the backend will return
    // null, based on that we can render the default message
    return this.args.repository.course.completionMessageMarkdown === null;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseCompletedCard': typeof CourseCompletedCardComponent;
  }
}
