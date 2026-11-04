import Component from '@glimmer/component';
import type InterviewMilestone from 'codecrafters-frontend/utils/interview-milestone';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type {
  ChallengeInterviewCodeFile,
  ChallengeInterviewQuestionVerdict,
  ChallengeInterviewReport,
} from 'codecrafters-frontend/models/challenge-interview';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    codeFiles: ChallengeInterviewCodeFile[];
    milestone: InterviewMilestone;
    onRetakeButtonClick: () => void;
    report: ChallengeInterviewReport;
    repository: RepositoryModel;
  };
}

type PillColor = 'green' | 'yellow' | 'red';

export default class CourseInterviewPageReport extends Component<Signature> {
  get demonstratedQuestionsCount(): number {
    return this.args.report.questions.filter((question) => question.verdict === 'demonstrated').length;
  }

  get overallVerdictColor(): PillColor {
    return ({ mixed: 'yellow', needs_review: 'red', strong: 'green' } as const)[this.args.report.overall_verdict];
  }

  get overallVerdictLabel(): string {
    return { mixed: 'Mixed understanding', needs_review: 'Needs review', strong: 'Strong understanding' }[this.args.report.overall_verdict];
  }

  get plannedQuestionsCount(): number {
    return this.args.report.planned_question_count ?? this.args.report.questions.length;
  }

  verdictColor = (verdict: ChallengeInterviewQuestionVerdict): PillColor => {
    return ({ demonstrated: 'green', not_demonstrated: 'red', partial: 'yellow' } as const)[verdict];
  };

  verdictLabel = (verdict: ChallengeInterviewQuestionVerdict): string => {
    return { demonstrated: 'Demonstrated', not_demonstrated: 'Not demonstrated', partial: 'Partially demonstrated' }[verdict];
  };
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseInterviewPage::Report': typeof CourseInterviewPageReport;
  }
}
