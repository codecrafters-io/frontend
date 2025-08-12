import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    icon?: string;
    iconUrl?: string;
    text: string;
    isActive: boolean;
    size?: 'small' | 'regular';
  };
}

export default class TabHeader extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TabHeader: typeof TabHeader;
  }
}
