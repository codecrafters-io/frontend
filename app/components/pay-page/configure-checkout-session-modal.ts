import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    onClose: () => void;
  };
}

export default class ConfigureCheckoutSessionModal extends Component<Signature> {
  @tracked temp = false;
}
