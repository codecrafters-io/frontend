import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import type CourseExtensionIdeaModel from 'codecrafters-frontend/models/course-extension-idea';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Store from '@ember-data/store';

export default class CourseExtensionIdeasController extends Controller {
  declare model: {
    courseExtensionIdeas: CourseExtensionIdeaModel[];
  };

  queryParams = [
    {
      selectedCourseSlug: 'course',
    },
  ];

  @tracked declare selectedCourseSlug: string;

  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  get orderedCourseExtensionIdeas() {
    return this.model.courseExtensionIdeas.filterBy('course', this.selectedCourse).sortBy('reverseSortPositionForVotePage').reverse();
  }

  get orderedCourses() {
    return this.model.courseExtensionIdeas.mapBy('course').uniq().sortBy('sortPositionForTrack');
  }

  get selectedCourse() {
    return this.store.peekAll('course').findBy('slug', this.selectedCourseSlug);
  }
}
