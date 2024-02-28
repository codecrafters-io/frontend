import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type CourseIdeaModel from 'codecrafters-frontend/models/course-idea';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export default class CourseIdeasController extends Controller {
  @service declare authenticator: AuthenticatorService;

  declare model: {
    courseIdeas: CourseIdeaModel[];
  };

  get orderedCourseIdeas() {
    return this.model.courseIdeas.rejectBy('isArchived').sortBy('reverseSortPositionForVotePage').reverse();
  }
}
