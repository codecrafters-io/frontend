import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import type CommunitySolutionEvaluationModel from 'codecrafters-frontend/models/community-solution-evaluation';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import { task } from 'ember-concurrency';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    diffSource: 'highlighted-files' | 'changed-files';
    onCollapseExampleLinkClick: () => void;
    onDiffSourceChange: (source: 'highlighted-files' | 'changed-files') => void;
    solution: CommunityCourseStageSolutionModel;
  };
}

export default class MoreDropdown extends Component<Signature> {
  @service declare store: Store;

  @action
  handleCollapseExampleLinkClick(dropdownActions: { close: () => void }) {
    this.args.onCollapseExampleLinkClick();
    dropdownActions.close();
  }

  @action
  async handleCopyIdLinkClick(dropdownActions: { close: () => void }) {
    await navigator.clipboard.writeText(this.args.solution.id);
    dropdownActions.close();
  }

  @action
  handleRunEvaluatorsClick(dropdownActions: { close: () => void }) {
    this.runEvaluatorsTask.perform();
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

  runEvaluatorsTask = task({ drop: true }, async (): Promise<void> => {
    const dummyRecord = this.store.createRecord('community-solution-evaluation') as CommunitySolutionEvaluationModel;

    await dummyRecord.generateForSolutions({
      solution_ids: [this.args.solution.id],
    });

    dummyRecord.unloadRecord();
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::CommunitySolutionCard::MoreDropdown': typeof MoreDropdown;
  }
}
