import { helper } from '@ember/component/helper';

const formatNumber = helper(function formatNumber([number]: [number] /*, named*/) {
  return number.toLocaleString();
});

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'format-number': typeof formatNumber;
  }
}

export default formatNumber;
