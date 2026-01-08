import Component from '@glimmer/component';
import type { FileTreeFolderItem, FileTreeItem } from 'codecrafters-frontend/components/file-tree-preview/types';
import type SetupStep from 'codecrafters-frontend/utils/course-page-step-list/setup-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onNextButtonClick: () => void;
    onStepSelect: (stepNumber: number) => void;
    step: SetupStep;
  };
}

export default class WorkflowTutorialStep1ScreenComponent extends Component<Signature> {
  get editableFilePathInFirstStageSolution(): string {
    if (!this.args.step.repository.firstStageSolution) {
      return 'README.md';
    }

    return this.args.step.repository.firstStageSolution.changedFiles[0]!.filename;
  }

  get rootFolderForfileTreePreview(): FileTreeFolderItem {
    return {
      type: 'folder',
      name: this.args.step.repository.cloneDirectory,
      children: [this.buildTreeForPath(this.editableFilePathInFirstStageSolution), { type: 'folder', name: 'other files', isGrayedOut: true }],
    };
  }

  buildTreeForPath(path: string) {
    const parts = path.split('/');

    let node: FileTreeItem = { type: 'file', name: parts[parts.length - 1]! };

    // Walk backwards through the path to build up the nested tree
    for (let i = parts.length - 2; i >= 0; i--) {
      node = { type: 'folder', name: parts[i]!, children: [node] };
    }

    return node;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SetupStepCompleteModal::WorkflowTutorialStep1Screen': typeof WorkflowTutorialStep1ScreenComponent;
  }
}
