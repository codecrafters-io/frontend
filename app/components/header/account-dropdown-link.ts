import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    icon: string;
    text: string;
  };
}

export default class HeaderAccountDropdownLinkComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Header::AccountDropdownLink': typeof HeaderAccountDropdownLinkComponent;
  }
}
