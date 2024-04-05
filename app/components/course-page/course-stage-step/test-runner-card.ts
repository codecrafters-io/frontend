import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;
};

export default class TestsPassedNoticeComponent extends Component<Signature> {
  get instructionsMarkdown() {
    return `
### Tests passed!

You can either refactor your code or move on to the next stage.

**To refactor your code**:

\`\`\`bash
# ... Make changes to your code, then run the tests again:
$ codecrafters test
\`\`\`

**To move on to the next stage**:

\`\`\`bash
$ git add .
$ git commit -m "pass stage" # any msg
$ git push origin master
\`\`\`
`;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::TestsPassedNotice': typeof TestsPassedNoticeComponent;
  }
}
