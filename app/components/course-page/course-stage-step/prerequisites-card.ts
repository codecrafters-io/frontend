import Component from '@glimmer/component';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    courseStage: CourseStageModel;
  };
}

export default class PrerequisitesCardComponent extends Component<Signature> {
  get prerequisiteInstructionsMarkdown() {
    return this.args.courseStage.prerequisiteInstructionsMarkdownFor(this.args.repository) as string;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::PrerequisitesCard': typeof PrerequisitesCardComponent;
  }
}
