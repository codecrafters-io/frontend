import { tracked } from '@glimmer/tracking';
import type ProgressIndicator from 'codecrafters-frontend/utils/course-page-step-list/progress-indicator';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import Step from 'codecrafters-frontend/utils/course-page-step-list/step';
import type CourseExtensionModel from 'codecrafters-frontend/models/course-extension';

export default class ExtensionCompletedStep extends Step {
  @tracked repository;
  @tracked extension;

  constructor(repository: RepositoryModel, extension: CourseExtensionModel) {
    super();

    this.repository = repository;
    this.extension = extension;
  }

  get isHidden() {
    if (!this.repository.extensionStagesAreComplete(this.extension)) {
      return true; // If the extension isn't complete, we don't want to show this step.
    }

    const isLastExtension = this.repository.activatedCourseExtensions.lastObject === this.extension;
    const allExtensionsAreActivated = this.repository.activatedCourseExtensions.length === this.repository.course.sortedExtensions.length;

    // If the extension is complete and it is the last extension, we don't want to show this step either.
    if (isLastExtension && allExtensionsAreActivated) {
      return true; // If the extension is complete and it is the last extension, we hide this and show the course completed step instead.
    }

    return false;
  }

  get progressIndicator(): ProgressIndicator {
    return {
      dotType: 'none',
      text: 'Congratulations!',
    };
  }

  get routeParams() {
    return {
      route: 'course.extension-completed',
      models: [this.repository.course.slug, this.extension.slug],
    };
  }

  get status() {
    if (this.repository.currentStage && !this.repository.stageIsComplete(this.repository.currentStage)) {
      return 'complete'; // If there's an incomplete stage ahead of us, the extension is complete.
    } else {
      return 'not_started';
    }
  }

  get title() {
    return 'Extension complete!';
  }

  get type(): 'ExtensionCompletedStep' {
    return 'ExtensionCompletedStep';
  }
}
