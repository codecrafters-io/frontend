import Component from '@glimmer/component';
import type SubmissionModel from 'codecrafters-frontend/models/submission';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    submission: SubmissionModel;
  };
};

export default class TestsPassedNoticeComponent extends Component<Signature> {
  get instructionsMarkdown() {
    return `
**To refactor your code**:

${this.runTestsInstructionsMarkdown}

**To move on to the next stage**:

\`\`\`bash
$ git add .
$ git commit -m "pass stage" # any msg
$ git push origin master
\`\`\`
`;
  }

  get runTestsInstructionsMarkdown() {
    if (this.args.submission.wasSubmittedViaCli) {
      return `
\`\`\`bash
# ... Make changes to your code, then run the tests again:
$ codecrafters test
\`\`\`
`;
    } else {
      return `
\`\`\`bash
# ... Make changes to your code, then run the tests again:
$ git add .
$ git commit -m "<any msg>"
$ git push origin master
\`\`\`
`;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::TestsPassedNotice': typeof TestsPassedNoticeComponent;
  }
}
