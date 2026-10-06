import Component from '@glimmer/component';
import type { ChallengeInterviewCodeAnchor, ChallengeInterviewCodeFile } from 'codecrafters-frontend/models/challenge-interview';

const CONTEXT_LINES = 2;

interface Signature {
  Element: HTMLDivElement;

  Args: {
    anchor: ChallengeInterviewCodeAnchor;
    codeFiles: ChallengeInterviewCodeFile[];
  };
}

type ExcerptLine = {
  isHighlighted: boolean;
  number: number;
  text: string;
};

export default class CourseInterviewPageCodeExcerpt extends Component<Signature> {
  get lines(): ExcerptLine[] {
    const file = this.args.codeFiles.find((item) => item.path === this.args.anchor.path);

    if (!file) {
      return [];
    }

    const allLines = file.contents.split('\n');
    const firstLine = Math.max(1, this.args.anchor.start_line - CONTEXT_LINES);
    const lastLine = Math.min(allLines.length, this.args.anchor.end_line + CONTEXT_LINES);

    return allLines.slice(firstLine - 1, lastLine).map((text, index) => {
      const number = firstLine + index;

      return {
        isHighlighted: number >= this.args.anchor.start_line && number <= this.args.anchor.end_line,
        number,
        text,
      };
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseInterviewPage::CodeExcerpt': typeof CourseInterviewPageCodeExcerpt;
  }
}
