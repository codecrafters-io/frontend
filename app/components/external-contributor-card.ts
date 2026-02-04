import Component from '@glimmer/component';

interface ContributorDetails {
  profileUrl: string;
  avatarUrl: string;
  name: string;
  headline: string;
}

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    contributorDetails: ContributorDetails;
  };
}

export default class ExternalContributorCard extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ExternalContributorCard: typeof ExternalContributorCard;
  }
}
