import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import Store from '@ember-data/store';
import type { TemporaryCourseStageModel, TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: TemporaryRepositoryModel;
    courseStage: TemporaryCourseStageModel;
  };
}

export default class LanguageInstructionsCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::LanguageInstructionsCard': typeof LanguageInstructionsCardComponent;
  }
}
