import Component from '@glimmer/component';
import logoImage from '/assets/images/logo/logomark-color.svg';

interface Signature {
  Element: HTMLDivElement;
}

export default class CreateMembershipGrantApplicationContainerComponent extends Component<Signature> {
  logoImage = logoImage;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'InstitutionPage::CreateMembershipGrantApplicationContainer': typeof CreateMembershipGrantApplicationContainerComponent;
  }
}
