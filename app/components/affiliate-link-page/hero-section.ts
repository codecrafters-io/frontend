import heroImage from '/assets/images/affiliate-program-features/cc-profile-image.png';
import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;
}

export default class HeroSectionComponent extends Component<Signature> {
  heroImage = heroImage;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliateLinkPage::HeroSection': typeof HeroSectionComponent;
  }
}
