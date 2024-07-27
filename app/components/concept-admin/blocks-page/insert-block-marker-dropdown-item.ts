import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    description: string;
    icon: string;
    title: string;
  };
}

export default class InsertBlockMarkerDropdownItemComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage::InsertBlockMarkerDropdownItem': typeof InsertBlockMarkerDropdownItemComponent;
  }
}
