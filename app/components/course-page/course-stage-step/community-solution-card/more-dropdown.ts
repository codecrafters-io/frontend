import Component from '@glimmer/component';
import { action } from '@ember/object';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    diffSource: 'highlighted-files' | 'changed-files';
    onCollapseExampleLinkClick: () => void;
    onDiffSourceChange: (source: 'highlighted-files' | 'changed-files') => void;
    solution: CommunityCourseStageSolutionModel;
  };
}

export default class MoreDropdownComponent extends Component<Signature> {
  @action
  handleCollapseExampleLinkClick(dropdownActions: { close: () => void }) {
    this.args.onCollapseExampleLinkClick();
    dropdownActions.close();
  }

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
