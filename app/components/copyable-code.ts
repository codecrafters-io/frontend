import Component from '@glimmer/component';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import config from 'codecrafters-frontend/config/environment';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    backgroundColor?: 'gray' | 'white';
    code: string;
    onCopyButtonClick?: () => void;
  };
}

export default class CopyableCode extends Component<Signature> {
  @tracked codeWasCopiedRecently: boolean = false;

  @action
  async handleCopyButtonClick() {
    await navigator.clipboard.writeText(this.args.code);

    this.codeWasCopiedRecently = true;

    later(
      this,
      () => {
        this.codeWasCopiedRecently = false;
      },
      config.environment !== 'test' ? 1000 : 10,
    );

    if (this.args.onCopyButtonClick) {
      this.args.onCopyButtonClick();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CopyableCode: typeof CopyableCode;
  }
}
