import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
    stages: CourseStageModel[];
  };
}

interface StageGroup {
  name: string;
  stages: CourseStageModel[];
}

export default class CourseInterviewPageCompletedStageGroups extends Component<Signature> {
  get groups(): StageGroup[] {
    const extensionGroups = this.args.course.sortedExtensions.map((extension) => ({
      name: extension.name,
      stages: this.args.stages.filter((stage) => stage.primaryExtensionSlug === extension.slug),
    }));

    const extensionStages = new Set(extensionGroups.flatMap((group) => group.stages));
    const baseGroup = { name: 'Base stages', stages: this.args.stages.filter((stage) => !extensionStages.has(stage)) };

    return [baseGroup, ...extensionGroups].filter((group) => group.stages.length > 0);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseInterviewPage::CompletedStageGroups': typeof CourseInterviewPageCompletedStageGroups;
  }
}
