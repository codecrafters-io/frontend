import Helper from '@ember/component/helper';
import { htmlSafe, type SafeString } from '@ember/template';

type Positional = [string?];
type Return = SafeString | undefined;

export interface Signature {
  Args: {
    Positional: Positional;
  };
  Return: Return;
}

/**
 * This helper mimics the behaviour of the original `html-safe` helper from the
 * `ember-cli-string-helpers` addon, but adds caching behaviour, reusing previously
 * created & returned instances of `SafeString` objects, based on input strings.
 */
export default class HtmlSafe extends Helper<Signature> {
  #cachedStrings: { [key: string]: SafeString } = {};

  public compute([unsafeString]: Positional): Return {
    if (!unsafeString) {
      return undefined;
    }

    if (this.#cachedStrings[unsafeString] !== undefined) {
      return this.#cachedStrings[unsafeString];
    }

    return (this.#cachedStrings[unsafeString] = htmlSafe(unsafeString));
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'html-safe': typeof HtmlSafe;
  }
}
