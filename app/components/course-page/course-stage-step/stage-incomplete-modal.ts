import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClose: () => void;
  };
}

export default class StageIncompleteModal extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::StageIncompleteModal': typeof StageIncompleteModal;
  }
}
