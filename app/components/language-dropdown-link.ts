import Component from '@glimmer/component';
import type { TemporaryLanguageModel } from 'codecrafters-frontend/lib/temporary-types';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    language: TemporaryLanguageModel;
    onClick: () => void;
    isSelected: boolean;
    isEnabled: boolean;
    isRequested: boolean;
  };
}

export default class LanguageDropdownLinkComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LanguageDropdownLink: typeof LanguageDropdownLinkComponent;
  }
}
