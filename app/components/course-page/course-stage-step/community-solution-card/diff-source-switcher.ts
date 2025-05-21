import { action } from '@ember/object';
import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    diffSource: 'changed-files' | 'highlighted-files';
    onDiffSourceChange: (diffSource: 'changed-files' | 'highlighted-files') => void;
  };
}

export default class DiffSourceSwitcherComponent extends Component<Signature> {
  @action
  handleClick() {
    this.args.onDiffSourceChange(this.args.diffSource === 'changed-files' ? 'highlighted-files' : 'changed-files');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::DiffSourceSwitcher': typeof DiffSourceSwitcherComponent;
  }
}
