import Model, { attr, belongsTo } from '@ember-data/model';
import QuestionnaireModel from 'codecrafters-frontend/models/questionnaire';

export default class CourseOnboardingQuestionnaireSubmissionModel extends Model {
  @belongsTo('repository') declare repository: unknown;
  @belongsTo('questionnaire') declare questionnaire: QuestionnaireModel;

  @attr() declare answers: {
    question_slug: string;
    answer: string;
  }[];
}
