import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import FastbootService from 'ember-cli-fastboot/services/fastboot';

export interface Signature {
  Args: {
    Positional: [];
  };

  Return: boolean;
}

export default class IsFastboot extends Helper<Signature> {
  @service declare fastboot: FastbootService;

  public compute(): boolean {
    return this.fastboot.isFastBoot;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'is-fastboot': typeof IsFastboot;
  }
}
