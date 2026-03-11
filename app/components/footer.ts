import Component from '@glimmer/component';
import logoIcon from '/assets/images/logo/logo-icon.svg';

interface FooterLink {
  text: string;
  url: string;
}

interface FooterLinkGroup {
  heading: string;
  links: FooterLink[];
}

export default class Footer extends Component {
  logoIcon = logoIcon;

  get challengeLinkGroup(): FooterLinkGroup {
    return {
      heading: 'Challenges',
      links: [
        { text: 'Git', url: 'https://app.codecrafters.io/courses/git/overview' },
        { text: 'Redis', url: 'https://app.codecrafters.io/courses/redis/overview' },
        { text: 'Shell', url: 'https://app.codecrafters.io/courses/shell/overview' },
        { text: 'Kafka', url: 'https://app.codecrafters.io/courses/kafka/overview' },
        { text: 'SQLite', url: 'https://app.codecrafters.io/courses/sqlite/overview' },
        { text: 'Grep', url: 'https://app.codecrafters.io/courses/grep/overview' },
        { text: 'BitTorrent', url: 'https://app.codecrafters.io/courses/bittorrent/overview' },
        { text: 'HTTP Server', url: 'https://app.codecrafters.io/courses/http-server/overview' },
        { text: 'DNS Server', url: 'https://app.codecrafters.io/courses/dns-server/overview' },
        { text: 'Interpreter', url: 'https://app.codecrafters.io/courses/interpreter/overview' },
        { text: 'Claude Code', url: 'https://app.codecrafters.io/courses/claude-code/overview' },
      ],
    };
  }

  get resourceLinkGroup(): FooterLinkGroup {
    return {
      heading: 'Resources',
      links: [
        { text: 'Changelog', url: 'https://twitter.com/codecraftersio' },
        { text: 'Forum', url: 'https://forum.codecrafters.io' },
        { text: 'Blog', url: 'https://codecrafters.io/blog' },
        { text: 'Help', url: 'https://docs.codecrafters.io/' },
        { text: 'Perks', url: 'https://codecrafters.io/perks' },
        { text: 'Expense', url: 'https://codecrafters.io/expense' },
        { text: 'Status', url: 'https://status.codecrafters.io/' },
      ],
    };
  }

  get companyLinkGroup(): FooterLinkGroup {
    return {
      heading: 'Company',
      links: [
        { text: 'About', url: 'https://codecrafters.io/about' },
        { text: 'Philosophy', url: 'https://codecrafters.io/philosophy' },
        { text: 'Pricing', url: 'https://codecrafters.io/pricing' },
        { text: 'Jobs', url: 'https://www.ycombinator.com/companies/codecrafters/jobs' },
        { text: 'For Investors', url: 'mailto:sarup@codecrafters.io' },
        { text: 'Bulk Licenses', url: 'mailto:sarup@codecrafters.io' },
      ],
    };
  }

  get legalLinkGroup(): FooterLinkGroup {
    return {
      heading: 'Legal',
      links: [
        { text: 'Terms', url: 'https://codecrafters.io/terms' },
        { text: 'Privacy', url: 'https://codecrafters.io/privacy' },
      ],
    };
  }

  get footerLinkGroups(): FooterLinkGroup[] {
    return [this.challengeLinkGroup, this.resourceLinkGroup, this.companyLinkGroup, this.legalLinkGroup];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Footer: typeof Footer;
  }
}
