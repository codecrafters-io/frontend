import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    icon?: string;
    iconUrl?: string;
    text: string;
    isActive: boolean;
    size?: 'small' | 'regular';
  };
};

export default class TabHeaderComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TabHeader: typeof TabHeaderComponent;
  }
}
