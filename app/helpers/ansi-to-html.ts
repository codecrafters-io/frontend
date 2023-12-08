import Helper from '@ember/component/helper';
import { htmlSafe } from '@ember/template';
import { SafeString } from '@ember/template/-private/handlebars';
import { AnsiUp } from 'ansi_up';

export interface Signature {
  Args: {
    Positional: Array<string | undefined | null>;
  };
  Return: SafeString | undefined;
}

export default class AnsiToHtml extends Helper<Signature> {
  public compute(positional: Array<string | undefined | null>): SafeString | undefined {
    if (!positional[0]) {
      return;
    }

    const htmlContent = this.convertAnsiToHtml(positional[0]);

    return htmlSafe(htmlContent);
  }

  public convertAnsiToHtml(raw: string): string {
    return new AnsiUp().ansi_to_html(raw);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ansi-to-html': typeof AnsiToHtml;
  }
}
