import Controller from '@ember/controller';
import { service } from '@ember/service';
import type CourseIdeaModel from 'codecrafters-frontend/models/course-idea';
import type CourseExtensionIdeaModel from 'codecrafters-frontend/models/course-extension-idea';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

export default class CourseIdeasController extends Controller {
  @service declare authenticator: AuthenticatorService;

  declare model: {
    courseIdeas: CourseIdeaModel[];
    courseExtensionIdeas: CourseExtensionIdeaModel[];
  };

  get orderedCourseIdeas() {
    return this.model.courseIdeas.filter((item) => !item.isArchived).sort(fieldComparator('sortPositionForRoadmapPage'));
  }
}
