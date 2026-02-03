import Component from '@glimmer/component';

interface ContributorDetails {
  avatarUrl: string;
}

interface Signature {
  Element: HTMLSpanElement;
  Args: {
    contributorType: 'author' | 'reviewer';
    contributorDetails: ContributorDetails;
  };
}

export default class ContributorAvatar extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ContributorAvatar: typeof ContributorAvatar;
  }
}
