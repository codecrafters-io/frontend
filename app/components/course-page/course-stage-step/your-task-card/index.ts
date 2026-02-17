import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import Store from '@ember-data/store';
import { service } from '@ember/service';
import type CourseStageSolutionModel from 'codecrafters-frontend/models/course-stage-solution';

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

  get solution(): CourseStageSolutionModel | null {
    return this.args.courseStage.solutions.find((s) => s.language === this.args.repository.language) || null;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::YourTaskCard': typeof YourTaskCard;
  }
}
