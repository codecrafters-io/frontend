import Model, { attr } from '@ember-data/model';

export default class QuestionnaireModel extends Model {
  @attr() declare questions: {
    slug: string;
    query_markdown: string;
    options: {
      markdown: string;
      explanation_markdown: string;
      explanation_type: 'success' | 'info' | 'warning';
    }[];
  }[];
}
