import { helper } from '@ember/component/helper';

const boolHelper = helper(function bool([value]) {
  return !!value;
});

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'bool': typeof boolHelper;
  }
}

export default boolHelper;
