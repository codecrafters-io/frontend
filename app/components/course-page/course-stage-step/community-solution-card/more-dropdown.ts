import Component from '@glimmer/component';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    diffSource: 'highlighted-files' | 'changed-files';
    onDiffSourceChange: (source: 'highlighted-files' | 'changed-files') => void;
  };
}

export default class MoreDropdownComponent extends Component<Signature> {
  @action
  handleViewFullDiffLinkClick(dropdownActions: { close: () => void }) {
    this.args.onDiffSourceChange('changed-files');
    dropdownActions.close();
  }

  @action
  handleViewHighlightedFilesLinkClick(dropdownActions: { close: () => void }) {
    this.args.onDiffSourceChange('highlighted-files');
    dropdownActions.close();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::MoreDropdown': typeof MoreDropdownComponent;
  }
}
