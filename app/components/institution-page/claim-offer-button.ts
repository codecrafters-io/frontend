import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;
}

export default class ClaimOfferButtonComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'InstitutionPage::ClaimOfferButton': typeof ClaimOfferButtonComponent;
  }
}
