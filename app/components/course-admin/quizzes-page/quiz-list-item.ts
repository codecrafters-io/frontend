import Component from '@glimmer/component';
import type CompetitionQuizModel from 'codecrafters-frontend/models/competition-quiz';
import type CourseModel from 'codecrafters-frontend/models/course';
import type { CompetitionQuizReviewDecision } from 'codecrafters-frontend/models/competition-quiz';

const DECISION_COLORS: Record<CompetitionQuizReviewDecision, 'green' | 'red'> = {
  eligible: 'green',
  not_eligible: 'red',
};

interface Signature {
  Element: HTMLLIElement;

  Args: {
    course: CourseModel;
    quiz: CompetitionQuizModel;
  };
}

export default class QuizListItem extends Component<Signature> {
  get decisionColor(): 'green' | 'red' | 'gray' {
    const decision = this.args.quiz.reviewDecision;

    return decision ? DECISION_COLORS[decision] : 'gray';
  }

  get stagesAsked(): string {
    return (this.args.quiz.report?.questions || [])
      .map((question) => question.stage?.name)
      .filter(Boolean)
      .join(', ');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::QuizzesPage::QuizListItem': typeof QuizListItem;
  }
}
