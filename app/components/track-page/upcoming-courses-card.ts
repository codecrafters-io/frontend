import Component from '@glimmer/component';
import image from '/assets/images/feature-previews/challenge-voting.png';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    logoImageUrl: string;
    logoImageAltText: string;
  };
}

export default class UpcomingCoursesCardComponent extends Component<Signature> {
  image = image;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::UpcomingCoursesCard': typeof UpcomingCoursesCardComponent;
  }
}
