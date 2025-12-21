import Modifier from 'ember-modifier';
import { service } from '@ember/service';
import type ConfettiService from 'codecrafters-frontend/services/confetti';

interface Signature {
  Args: {
    Positional: [];
  };
}

export default class FireConfettiOnInsertModifier extends Modifier<Signature> {
  @service declare confetti: ConfettiService;

  modify(element: HTMLElement, _positional: []) {
    this.confetti.fireFromElement(element);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'fire-confetti-on-insert': typeof FireConfettiOnInsertModifier;
  }
}
