import Controller from '@ember/controller';
import type { ModelType } from 'codecrafters-frontend/routes/course-interview';
import { tracked } from '@glimmer/tracking';

export default class CourseInterviewController extends Controller {
  declare model: ModelType;

  queryParams = ['interview', 'repo'];

  @tracked interview: string | null = null;
  @tracked repo: string | null = null;
}
