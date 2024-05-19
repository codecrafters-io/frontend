import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export type CopyableTerminalCommandVariant = {
  label: string;
  commands: string[];
};

interface Signature {
  Element: HTMLElement;

  Args: {
    onCopyButtonClick?: () => void;
    onVariantSelect?: (variant: CopyableTerminalCommandVariant) => void;
    variants: CopyableTerminalCommandVariant[];
  };
}

export default class CopyableTerminalCommandWithVariantsComponent extends Component<Signature> {
  @tracked selectedVariantIndex: number;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    this.selectedVariantIndex = 0;
  }

  get commandsForSelectedVariant() {
    return this.selectedVariant!.commands;
  }

  get selectedVariant() {
    return this.args.variants[this.selectedVariantIndex] || this.args.variants[0];
  }

  get variantLabels() {
    return this.args.variants.map((variant) => variant.label);
  }

  @action
  handleVariantSelect(variantLabel: string) {
    this.selectedVariantIndex = this.args.variants.findIndex((variant) => variant.label === variantLabel) ?? 0;

    if (this.args.onVariantSelect) {
      this.args.onVariantSelect(this.selectedVariant!);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CopyableTerminalCommandWithVariants: typeof CopyableTerminalCommandWithVariantsComponent;
  }
}
