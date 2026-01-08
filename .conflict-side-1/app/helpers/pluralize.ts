import { helper } from '@ember/component/helper';
import { pluralize as inflectorPluralize } from 'ember-inflector';

// Usage:
// {{pluralize "apple"}} => "apples"
// {{pluralize "apple" count=1}} => "apple"
// {{pluralize "apple" count=2}} => "apples"
// {{pluralize "ox" count=2 plural="oxen"}} => "oxen"
const pluralize = helper(function pluralize([singular]: [string], { count, plural }: { count?: number; plural?: string }) {
  if (count === 1) {
    return singular;
  }

  return plural || inflectorPluralize(singular);
});

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    pluralize: typeof pluralize;
  }
}

export default pluralize;
