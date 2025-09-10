import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClose: () => void;
  };
}

export default class StageIncompleteModal extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::StageIncompleteModal': typeof StageIncompleteModal;
  }
}
