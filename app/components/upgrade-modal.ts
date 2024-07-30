import Component from '@glimmer/component';
import type { Signature as UpgradePromptSignature } from './course-page/course-stage-step/upgrade-prompt';

interface Signature {
  Element: HTMLDivElement;

  Args: UpgradePromptSignature['Args'] & {
    onClose: () => void;
  };
}

export default class UpgradeModalComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    UpgradeModal: typeof UpgradeModalComponent;
  }
}
