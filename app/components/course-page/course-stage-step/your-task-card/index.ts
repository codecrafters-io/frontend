import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import Store from '@ember-data/store';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    title?: string;
    courseStage: CourseStageModel;
    repository: RepositoryModel;
  };
}

export default class YourTaskCard extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;

  get instructionsMarkdown() {
    return this.args.courseStage.buildInstructionsMarkdownFor(this.args.repository);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::YourTaskCard': typeof YourTaskCard;
  }
}
