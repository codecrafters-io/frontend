import Controller from '@ember/controller';
import type { ModelType } from 'codecrafters-frontend/routes/course-quiz';
import { tracked } from '@glimmer/tracking';

export default class CourseQuizController extends Controller {
  declare model: ModelType;

  queryParams = ['repo'];

  @tracked repo: string | null = null;
}
