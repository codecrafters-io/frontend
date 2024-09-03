import Controller from '@ember/controller';
import type { ModelType } from 'codecrafters-frontend/routes/join-course';

export default class JoinCourseController extends Controller {
  declare model: ModelType;

  queryParams = [{ affiliateLinkSlug: 'via' }];
}
