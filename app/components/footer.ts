import Component from '@glimmer/component';
import wordmarkDark from '/assets/images/logo/wordmark-dark.svg';

interface FooterLink {
  mobileText?: string;
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
          mobileText: 'BYO Git',
          text: 'Build your own Git',
          url: 'https://app.codecrafters.io/courses/git/overview',
        },
        {
          mobileText: 'BYO Grep',
          text: 'Build your own Grep',
          url: 'https://app.codecrafters.io/courses/grep/overview',
        },
        {
          mobileText: 'BYO Redis',
          text: 'Build your own Redis',
          url: 'https://app.codecrafters.io/courses/redis/overview',
        },
        {
          mobileText: 'BYO Shell',
          text: 'Build your own Shell',
          url: 'https://app.codecrafters.io/courses/shell/overview',
        },
        {
          mobileText: 'BYO Kafka',
          text: 'Build your own Kafka',
          url: 'https://app.codecrafters.io/courses/kafka/overview',
        },
        {
          mobileText: 'BYO SQLite',
          text: 'Build your own SQLite',
          url: 'https://app.codecrafters.io/courses/sqlite/overview',
        },
        {
          mobileText: 'BYO BitTorrent',
          text: 'Build your own BitTorrent',
          url: 'https://app.codecrafters.io/courses/bittorrent/overview',
        },
        {
          mobileText: 'BYO DNS Server',
          text: 'Build your own DNS Server',
          url: 'https://app.codecrafters.io/courses/dns-server/overview',
        },
        {
          mobileText: 'BYO HTTP Server',
          text: 'Build your own HTTP Server',
          url: 'https://app.codecrafters.io/courses/http-server/overview',
        },
        {
          mobileText: 'BYO Interpreter',
          text: 'Build your own Interpreter',
          url: 'https://app.codecrafters.io/courses/interpreter/overview',
        },
        {
          mobileText: 'BYO Claude Code',
          text: 'Build your own Claude Code',
          url: 'https://app.codecrafters.io/courses/claude-code/overview',
        },
      ],
    };
  }

  get resourcesLinkGroup(): FooterLinkGroup {
    return {
      heading: 'Resources',
      links: [
        {
          text: 'Docs',
          url: 'https://docs.codecrafters.io/',
        },
        {
          text: 'Status',
          url: 'https://status.codecrafters.io/',
        },
        {
          text: 'About',
          url: 'https://codecrafters.io/about',
        },
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
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Footer: typeof Footer;
  }
}
