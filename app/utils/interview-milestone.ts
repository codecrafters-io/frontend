import type CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

export default class InterviewMilestone {
  static BASE_STAGES_SLUG = 'base-stages';

  extension: CourseExtensionModel | null;
  repository: RepositoryModel;

  constructor(repository: RepositoryModel, extension: CourseExtensionModel | null) {
    this.repository = repository;
    this.extension = extension;
  }

  get isComplete(): boolean {
    return this.stages.length > 0 && this.stages.every((stage) => this.repository.stageIsComplete(stage));
  }

  get slug(): string {
    return this.extension ? this.extension.slug : InterviewMilestone.BASE_STAGES_SLUG;
  }

  get stages(): CourseStageModel[] {
    return this.extension ? this.extension.sortedStages : this.repository.course.sortedBaseStages;
  }

  get title(): string {
    return this.extension ? this.extension.name : 'Base stages';
  }

  static forBaseStages(repository: RepositoryModel): InterviewMilestone {
    return new InterviewMilestone(repository, null);
  }

  // The course-completed card replaces the last milestone's own completion screen, so it offers that milestone.
  static forCourseCompletedCard(repository: RepositoryModel): InterviewMilestone {
    const lastActivatedExtension = repository.activatedCourseExtensions.at(-1);

    if (!repository.course.hasExtensions || !lastActivatedExtension) {
      return InterviewMilestone.forBaseStages(repository);
    }

    return InterviewMilestone.forExtension(repository, lastActivatedExtension);
  }

  static forExtension(repository: RepositoryModel, extension: CourseExtensionModel): InterviewMilestone {
    return new InterviewMilestone(repository, extension);
  }

  static fromSlug(repository: RepositoryModel, slug: string): InterviewMilestone | null {
    if (slug === InterviewMilestone.BASE_STAGES_SLUG) {
      return InterviewMilestone.forBaseStages(repository);
    }

    const extension = repository.course.extensions.find((item) => item.slug === slug);

    return extension ? InterviewMilestone.forExtension(repository, extension) : null;
  }
}
