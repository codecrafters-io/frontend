import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

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

type SocialPlatform = 'twitter' | 'slack' | 'discord' | 'linkedin';

export default class ShareProgressModalComponent extends Component<Signature> {
  fade = fade;

  socialPlatforms: SocialPlatform[] = ['twitter', 'slack', 'discord', 'linkedin'];

  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

  @tracked copyableText: string = '';
  @tracked selectedSocialPlatform: SocialPlatform = 'twitter';
  @tracked wasCopiedRecently: boolean = false;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    this.copyableText = this.defaultCopyableText;
  }

  get defaultCopyableText() {
    if (this.selectedSocialPlatform === 'twitter') {
      return `I'm working on the @codecraftersio ${this.args.repository.course.name} challenge in ${this.args.repository.language?.name}.\n\nhttps://app.codecrafters.io/courses/${this.args.repository.course.slug}/overview`;
    } else {
      return `I'm working on the CodeCrafters ${this.args.repository.course.name} challenge in ${this.args.repository.language?.name}.\n\nhttps://app.codecrafters.io/courses/${this.args.repository.course.slug}/overview`;
    }
  }

  @action
  handleCopyButtonClick() {
    this.analyticsEventTracker.track('copied_share_progress_text', {
      repository_id: this.args.repository.id,
    });

    this.copyToClipboardAndFlashMessage.perform();
  }

  @action
  handleSocialPlatformClick(platform: SocialPlatform) {
    this.selectedSocialPlatform = platform;
    this.copyableText = this.defaultCopyableText;
  }

  copyToClipboardAndFlashMessage = task({ keepLatest: true }, async (): Promise<void> => {
    await navigator.clipboard.writeText(this.copyableText);
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
