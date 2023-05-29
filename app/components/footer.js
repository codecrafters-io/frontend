import Component from '@glimmer/component';
import image from '/assets/images/logo/logomark-color.svg';

export default class FooterComponent extends Component {
  image = image;

  get footerLinkGroups() {
    return [this.challengeLinkGroup, this.supportLinkGroup, this.companyLinkGroup, this.legalLinkGroup];
  }

  get challengeLinkGroup() {
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
      ],
    };
  }

  get supportLinkGroup() {
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

  get companyLinkGroup() {
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

  get legalLinkGroup() {
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
}
