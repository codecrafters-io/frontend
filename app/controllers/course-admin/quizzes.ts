import Controller from '@ember/controller';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import type CompetitionQuizModel from 'codecrafters-frontend/models/competition-quiz';
import type { CourseAdminQuizzesRouteModel } from 'codecrafters-frontend/routes/course-admin/quizzes';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CourseAdminQuizzesController extends Controller {
  declare model: CourseAdminQuizzesRouteModel;

  @tracked shouldShowUndecidedOnly = false;

  get visibleQuizzes(): CompetitionQuizModel[] {
    const quizzes = this.shouldShowUndecidedOnly ? this.model.quizzes.filter((quiz) => !quiz.reviewDecision) : this.model.quizzes;

    return quizzes.toSorted(fieldComparator('endedAt')).reverse();
  }

  @action
  handleUndecidedOnlyToggle(): void {
    this.shouldShowUndecidedOnly = !this.shouldShowUndecidedOnly;
  }
}
