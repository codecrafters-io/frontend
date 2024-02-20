import Component from '@glimmer/component';
import { capitalize } from '@ember/string';

import discordLogoImage from 'codecrafters-frontend/images/social-icons/discord.svg';
import linkedinLogoImage from 'codecrafters-frontend/images/social-icons/linkedin.svg';
import slackLogoImage from 'codecrafters-frontend/images/social-icons/slack.svg';
import twitterLogoImage from 'codecrafters-frontend/images/social-icons/twitter.svg';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    onClick: (platform: string) => void;
    platform: string;
    selectedSocialPlatform: string;
  };
};

export default class CoursePageShareProgressModalIconComponent extends Component<Signature> {
  get isSelected(): boolean {
    return this.args.selectedSocialPlatform === this.args.platform;
  }

  get platformLogoImage(): 'twitter' | 'discord' | 'linkedin' | 'slack' {
    if (this.args.platform === 'discord') {
      return discordLogoImage;
    }

    if (this.args.platform === 'linkedin') {
      return linkedinLogoImage;
    }

    if (this.args.platform === 'slack') {
      return slackLogoImage;
    }

    if (this.args.platform === 'twitter') {
      return twitterLogoImage;
    }

    throw new Error(`Unknown platform: ${this.args.platform}`);
  }

  get platformLogoAltText(): string {
    return `${capitalize(this.args.platform)} Icon`
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ShareProgressModal::Icon': typeof CoursePageShareProgressModalIconComponent;
  }
}
