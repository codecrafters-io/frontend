import Component from '@glimmer/component';
import type { ChallengeInterviewCodeFile } from 'codecrafters-frontend/models/challenge-interview';
import type { QuizQuestionRow } from 'codecrafters-frontend/controllers/course-admin/quiz';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    codeFiles: ChallengeInterviewCodeFile[] | null;
    isScored: boolean;
    participantUsername: string;
    row: QuizQuestionRow;
  };
}

const VERDICTS = {
  demonstrated: { color: 'green', label: 'Explained it' },
  not_demonstrated: { color: 'red', label: "Couldn't explain" },
  partial: { color: 'yellow', label: 'Partly explained' },
} as const;

export default class QuestionCard extends Component<Signature> {
  get verdictColor(): 'green' | 'red' | 'yellow' | 'gray' {
    const verdict = this.args.row.scored?.verdict;

    return verdict ? VERDICTS[verdict].color : 'gray';
  }

  get verdictLabel(): string {
    const verdict = this.args.row.scored?.verdict;

    if (verdict) {
      return VERDICTS[verdict].label;
    }

    return this.args.isScored ? 'Not answered' : 'Not scored';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::QuizPage::QuestionCard': typeof QuestionCard;
  }
}
