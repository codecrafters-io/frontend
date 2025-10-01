import Component from '@glimmer/component';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import RepositoryModel from 'codecrafters-frontend/models/repository';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    extension: CourseExtensionModel;
    repository: RepositoryModel;
    isActivated: boolean;
  };
}

export default class ExtensionProgressPill extends Component<Signature> {
  get progressPillColor(): 'green' | 'yellow' | null {
    if (!this.args.isActivated) {
      return null;
    }

    const stages = this.args.extension.sortedStages;
    const allComplete = stages.every((stage) => this.args.repository.stageIsComplete(stage));
    const currentStageInExtension = this.args.repository.currentStage && stages.includes(this.args.repository.currentStage);

    if (allComplete) return 'green';
    if (currentStageInExtension) return 'yellow';

    return null;
  }

  get progressPillText(): string {
    return this.progressPillColor === 'green' ? 'Completed' : 'In Progress';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ConfigureExtensionsModal::ExtensionProgressPill': typeof ExtensionProgressPill;
  }
}
