import Component from '@glimmer/component';
import type AutofixRequestModel from 'codecrafters-frontend/models/autofix-request';
import fade from 'ember-animated/transitions/fade';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    autofixRequest: AutofixRequestModel;
  };
}

export default class AutofixRequestCard extends Component<Signature> {
  transition = fade;

  @tracked diffWasUnblurred = false;
  @tracked explanationWasUnblurred = false;

  get changedFilesForRender(): AutofixRequestModel['changedFiles'] {
    if (this.args.autofixRequest.status === 'in_progress') {
      return [
        {
          filename: 'placeholder.txt', // TODO: This should be the actual filename
          diff: `
  def main():
-     print("Hello, world!")
+     print("Hello, worlds!")

+     foo = calculate(bar)

  if __name__ == "__main__":
      main()
`,
        },
      ];
    } else {
      return this.args.autofixRequest.changedFiles;
    }
  }

  get diffIsBlurred() {
    // We never show a diff unless the autofix request is successful
    if (this.args.autofixRequest.status !== 'success') {
      return true;
    }

    return !this.diffWasUnblurred;
  }

  get explanationIsBlurred() {
    if (this.args.autofixRequest.status !== 'success') {
      return true;
    }

    return !this.explanationWasUnblurred;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::AutofixRequestCard': typeof AutofixRequestCard;
  }
}
