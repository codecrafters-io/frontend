import Component from '@glimmer/component';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClose: () => void;
  };
}

export default class TroubleshootingModal extends Component<Signature> {
  get contentMarkdown() {
    return `We've compiled some guides for common issues:

- [Not sure how to run git commands](https://docs.codecrafters.io/challenges/how-challenges-work#how-to-run-git-commands)
- [Running into issues with the git clone step](https://docs.codecrafters.io/troubleshooting/fix-clone-errors)
- [How do I install the CLI?](https://docs.codecrafters.io/cli)`;
  }

  @action
  handleWriteToUsLinkClick() {
    // @ts-expect-error Beacon not registered yet
    window.Beacon('open');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SetupStep::RepositorySetupCard::TroubleshootingModal': typeof TroubleshootingModal;
  }
}
