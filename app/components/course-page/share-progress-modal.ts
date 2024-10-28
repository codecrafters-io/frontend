import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import RepositoryModel from 'codecrafters-frontend/models/repository';

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

  @tracked selectedSocialPlatform: SocialPlatform = 'twitter';

  get copyableText() {
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
  }

  @action
  handleSocialPlatformClick(platform: SocialPlatform) {
    this.selectedSocialPlatform = platform;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ShareProgressModal': typeof ShareProgressModalComponent;
  }
}
