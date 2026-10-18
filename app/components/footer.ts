import Component from '@glimmer/component';
import wordmarkDark from '/assets/images/logo/wordmark-dark.svg';

interface FooterLink {
  text: string;
  url: string;
}

interface FooterLinkGroup {
  heading: string;
  links: FooterLink[];
}

export default class Footer extends Component {
  wordmarkDark = wordmarkDark;

  get challengeLinkGroup(): FooterLinkGroup {
    return {
      heading: 'Challenges',
      links: [
        {
          text: 'Build your own Git',
          url: 'https://app.codecrafters.io/courses/git/overview',
        },
        {
          text: 'Build your own Grep',
          url: 'https://app.codecrafters.io/courses/grep/overview',
        },
        {
          text: 'Build your own Redis',
          url: 'https://app.codecrafters.io/courses/redis/overview',
        },
        {
          text: 'Build your own Shell',
          url: 'https://app.codecrafters.io/courses/shell/overview',
        },
        {
          text: 'Build your own Kafka',
          url: 'https://app.codecrafters.io/courses/kafka/overview',
        },
        {
          text: 'Build your own SQLite',
          url: 'https://app.codecrafters.io/courses/sqlite/overview',
        },
        {
          text: 'Build your own BitTorrent',
          url: 'https://app.codecrafters.io/courses/bittorrent/overview',
        },
        {
          text: 'Build your own DNS Server',
          url: 'https://app.codecrafters.io/courses/dns-server/overview',
        },
        {
          text: 'Build your own HTTP Server',
          url: 'https://app.codecrafters.io/courses/http-server/overview',
        },
        {
          text: 'Build your own Interpreter',
          url: 'https://app.codecrafters.io/courses/interpreter/overview',
        },
        {
          text: 'Build your own Claude Code',
          url: 'https://app.codecrafters.io/courses/claude-code/overview',
        },
      ],
    };
  }

  get companyLinkGroup(): FooterLinkGroup {
    return {
      heading: 'Company',
      links: [
        {
          text: 'About',
          url: 'https://codecrafters.io/about',
        },
      ],
    };
  }

  get footerLinkGroups(): FooterLinkGroup[] {
    return [this.challengeLinkGroup, this.supportLinkGroup, this.companyLinkGroup, this.legalLinkGroup];
  }

  get legalLinkGroup(): FooterLinkGroup {
    return {
      heading: 'Legal',
      links: [
        {
          text: 'Terms',
          url: 'https://codecrafters.io/terms',
        },
        {
          text: 'Privacy',
          url: 'https://codecrafters.io/privacy',
        },
      ],
    };
  }

  get supportLinkGroup(): FooterLinkGroup {
    return {
      heading: 'Support',
      links: [
        {
          text: 'Docs',
          url: 'https://docs.codecrafters.io/',
        },
        {
          text: 'Status',
          url: 'https://status.codecrafters.io/',
        },
      ],
    };
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Footer: typeof Footer;
  }
}
