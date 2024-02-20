import Component from '@glimmer/component';

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

  get platformLogoImage(): string {
    switch (this.args.platform) {
      case 'discord':
        return discordLogoImage;
      case 'linkedin':
        return linkedinLogoImage;
      case 'slack':
        return slackLogoImage;
      case 'twitter':
        return twitterLogoImage;
      default:
        return '';
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ShareProgressModal::Icon': typeof CoursePageShareProgressModalIconComponent;
  }
}
