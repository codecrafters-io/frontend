import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Blocks: {
    default: [];
  };
}

export default class AlertComponent extends Component<Signature> {}
