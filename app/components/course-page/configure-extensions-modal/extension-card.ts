import Component from '@glimmer/component';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    extension: CourseExtensionModel;
    isDisabling?: boolean;
    onToggle: (extension: CourseExtensionModel) => Promise<void>;
  };
}

export default class ExtensionCard extends Component<Signature> {
  @tracked unsavedIsActivatedValue: boolean | null = null;

  get activations() {
    return this.args.repository.extensionActivations.filter((activation) => activation.extension === this.args.extension);
  }

  get isActivated(): boolean {
    return this.activations.length > 0;
  }

  get optimisticValueForIsActivated(): boolean {
    if (this.args.isDisabling) {
      return false;
    }

    return this.unsavedIsActivatedValue ?? this.isActivated;
  }

  get progressPillType(): 'completed' | 'in_progress' | null {
    const stages = this.args.extension.sortedStages;
    const allComplete = stages.length > 0 && stages.every((stage) => this.args.repository.stageIsComplete(stage));
    const currentStageInExtension = this.args.repository.currentStage && stages.includes(this.args.repository.currentStage);

    if (allComplete) return 'completed';
    if (currentStageInExtension) return 'in_progress';

    return null;
  }

  @action
  async handleClick(): Promise<void> {
    this.unsavedIsActivatedValue = !this.optimisticValueForIsActivated;
    this.syncActivation.perform();
  }

  syncActivation = task({ keepLatest: true }, async (): Promise<void> => {
    if (this.unsavedIsActivatedValue === null) {
      return;
    }

    await this.args.onToggle(this.args.extension);
    this.unsavedIsActivatedValue = null;
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ConfigureExtensionsModal::ExtensionCard': typeof ExtensionCard;
  }
}
