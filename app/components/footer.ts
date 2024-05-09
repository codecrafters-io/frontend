import Component from '@glimmer/component';
import image from '/assets/images/logo/logomark-color.svg';

interface FooterLink {
  text: string;
  url: string;
}

interface FooterLinkGroup {
  heading: string;
  links: FooterLink[];
}

export default class FooterComponent extends Component {
  image = image;

  get challengeLinkGroup(): FooterLinkGroup {
    return {
      heading: 'Challenges',
      links: [
        {
          text: 'Git',
          url: 'https://app.codecrafters.io/courses/git/overview',
        },
        {
          text: 'Redis',
          url: 'https://app.codecrafters.io/courses/redis/overview',
        },
        {
          text: 'Docker',
          url: 'https://app.codecrafters.io/courses/docker/overview',
        },
        {
          text: 'SQLite',
          url: 'https://app.codecrafters.io/courses/sqlite/overview',
        },
        {
          text: 'Grep',
          url: 'https://app.codecrafters.io/courses/grep/overview',
        },
        {
          text: 'BitTorrent',
          url: 'https://app.codecrafters.io/courses/bittorrent/overview',
        },
        {
          text: 'HTTP Server',
          url: 'https://app.codecrafters.io/courses/http-server/overview',
        },
        {
          text: 'DNS Server',
          url: 'https://app.codecrafters.io/courses/dns-server/overview',
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
        {
          text: 'Changelog',
          url: 'https://twitter.com/codecraftersio',
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
    Footer: typeof FooterComponent;
  }
}
