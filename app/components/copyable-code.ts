import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import config from 'codecrafters-frontend/config/environment';
import { task, timeout } from 'ember-concurrency';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    backgroundColor?: 'gray' | 'white';
    code: string;
    onCopyButtonClick?: () => void;
  };
}

export default class CopyableCodeComponent extends Component<Signature> {
  @tracked codeWasCopiedRecently: boolean = false;

  handleCopyButtonClickTask = task({ keepLatest: true }, async (): Promise<void> => {
    await navigator.clipboard.writeText(this.args.code);
    this.codeWasCopiedRecently = true;

    if (this.args.onCopyButtonClick) {
      this.args.onCopyButtonClick();
    }

    await timeout(config.x.copyConfirmationTimeout);
    this.codeWasCopiedRecently = false;
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CopyableCode: typeof CopyableCodeComponent;
  }
}
