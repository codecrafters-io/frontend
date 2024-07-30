import Component from '@glimmer/component';
import DarkModeService from 'codecrafters-frontend/services/dark-mode';
import discordLogoImage from 'codecrafters-frontend/images/social-icons/discord.svg';
import linkedinLogoImage from 'codecrafters-frontend/images/social-icons/linkedin.svg';
import slackLogoImage from 'codecrafters-frontend/images/social-icons/slack.svg';
import twitterLogoImage from 'codecrafters-frontend/images/social-icons/twitter.svg';
import twitterWhiteLogoImage from 'codecrafters-frontend/images/social-icons/twitter-white.svg';
import { capitalize } from '@ember/string';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClick: (platform: SocialPlatform) => void;
    platform: 'twitter' | 'discord' | 'linkedin' | 'slack';
    selectedSocialPlatform: string;
  };
}

type SocialPlatform = 'twitter' | 'slack' | 'discord' | 'linkedin';

export default class CoursePageShareProgressModalIconComponent extends Component<Signature> {
  @service declare darkMode: DarkModeService;

  get isSelected(): boolean {
    return this.args.selectedSocialPlatform === this.args.platform;
  }

  get platformLogoAltText(): string {
    return `${capitalize(this.args.platform)} Icon`;
  }

  get platformLogoImage(): string {
    return {
      discord: discordLogoImage,
      linkedin: linkedinLogoImage,
      slack: slackLogoImage,
      twitter: this.darkMode.isEnabled ? twitterWhiteLogoImage : twitterLogoImage,
    }[this.args.platform];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ShareProgressModal::Icon': typeof CoursePageShareProgressModalIconComponent;
  }
}
