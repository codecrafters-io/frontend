import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    text: string;
    icon: string;
  };
};

export default class HeaderAccountDropdownLinkComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Header::AccountDropdownLink': typeof HeaderAccountDropdownLinkComponent;
  }
}
