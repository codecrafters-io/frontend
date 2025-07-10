import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type CourseIdeaModel from 'codecrafters-frontend/models/course-idea';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Store from '@ember-data/store';

export default class CourseIdeasController extends Controller {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  declare model: {
    courseIdeas: CourseIdeaModel[];
  };

  get orderedCourseIdeas() {
    return this.model.courseIdeas.rejectBy('isArchived').sortBy('sortPositionForRoadmapPage');
  }

  get releasedCourseExtensionIdeas() {
    return this.store.peekAll('course-extension-idea').filterBy('developmentStatusIsReleased');
  }

  get releasedCourseIdeas() {
    return this.model.courseIdeas.filterBy('developmentStatusIsReleased');
  }
}
