import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    icon: string;
    title: string;
    description: string;
  };
}

export default class InsertBlockMarkerDropdownItemComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage::InsertBlockMarkerDropdownItem': typeof InsertBlockMarkerDropdownItemComponent;
  }
}
