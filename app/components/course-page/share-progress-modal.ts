import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import { task, timeout } from 'ember-concurrency';
import fade from 'ember-animated/transitions/fade';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    onClose: () => void;
  };

  Blocks: {
    default: [];
  };
}

export default class ShareProgressModalComponent extends Component<Signature> {
  fade = fade;

  @tracked wasCopiedRecently = false;
  @tracked copyableText = 'I just completed...';

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);
    this.copyableText =
      'Just completed Stage #2 of the @codecraftersio Build your own Redis challenge in Rust.\n\nhttps://app.codecrafters.io/courses/redis/overview';
  }

  @action
  handleCopyButtonClick() {
    this.copyToClipboardAndFlashMessage.perform();
  }

  copyToClipboardAndFlashMessage = task({ keepLatest: true }, async (): Promise<void> => {
    await navigator.clipboard.writeText('dummy');

    this.wasCopiedRecently = true;
    await timeout(1000);
    this.wasCopiedRecently = false;
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ShareProgressModal': typeof ShareProgressModalComponent;
  }
}
