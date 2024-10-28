import Component from '@glimmer/component';
import { service } from '@ember/service';
import type ClipboardService from 'codecrafters-frontend/services/clipboard';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    backgroundColor?: 'gray' | 'white';
    code: string;
    onCopyButtonClick?: () => void | Promise<void>;
  };
}

export default class CopyableCodeComponent extends Component<Signature> {
  @service declare clipboard: ClipboardService;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CopyableCode: typeof CopyableCodeComponent;
  }
}
