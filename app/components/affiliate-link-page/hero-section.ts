import heroImage from '/assets/images/affiliate-program-features/cc-profile-image.png';
import Component from '@glimmer/component';

export default class HeroSectionComponent extends Component {
  heroImage = heroImage;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliateLinkPage::HeroSection': typeof HeroSectionComponent;
  }
}
