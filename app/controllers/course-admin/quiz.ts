import Controller from '@ember/controller';
import type {
  ChallengeInterviewCodeAnchor,
  ChallengeInterviewReportQuestion,
  ChallengeInterviewStage,
} from 'codecrafters-frontend/models/challenge-interview';
import type { CourseAdminQuizRouteModel } from 'codecrafters-frontend/routes/course-admin/quiz';

export type QuizQuestionRow = {
  anchor: ChallengeInterviewCodeAnchor | null;
  question: string;
  scored: ChallengeInterviewReportQuestion | null;
  stage: ChallengeInterviewStage | null;
};

export default class CourseAdminQuizController extends Controller {
  declare model: CourseAdminQuizRouteModel;

  // Planned questions come first, so ones the participant never answered still get a row.
  get questionRows(): QuizQuestionRow[] {
    const scoredQuestions = this.model.quiz.report?.questions || [];
    const plannedQuestions = this.model.quiz.plan?.questions;

    if (!plannedQuestions) {
      return scoredQuestions.map((scored) => ({ anchor: scored.anchor, question: scored.question, scored, stage: scored.stage || null }));
    }

    return plannedQuestions.map((planned) => ({
      anchor: planned.anchor,
      question: planned.question,
      scored: scoredQuestions.find((scored) => scored.question === planned.question) || null,
      stage: planned.stage || null,
    }));
  }
}
