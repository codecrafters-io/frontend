import Component from '@glimmer/component';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

export default class CopyableCodeComponent extends Component {
  @tracked codeWasCopiedRecently;

  @action
  handleCopyButtonClick() {
    navigator.clipboard.writeText(this.args.code);

    this.codeWasCopiedRecently = true;

    later(
      this,
      () => {
        this.codeWasCopiedRecently = false;
      },
      1000
    );
  }
}
