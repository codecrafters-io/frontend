import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import type CourseExtensionIdeaModel from 'codecrafters-frontend/models/course-extension-idea';
import type CourseIdeaModel from 'codecrafters-frontend/models/course-idea';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Store from '@ember-data/store';
import type CourseModel from 'codecrafters-frontend/models/course';

export default class CourseExtensionIdeasController extends Controller {
  declare model: {
    courseIdeas: CourseIdeaModel[];
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
    return this.model.courseExtensionIdeas.filterBy('course', this.selectedCourse).sortBy('sortPositionForRoadmapPage');
  }

  get orderedCourses() {
    return this.model.courseExtensionIdeas
      .rejectBy('developmentStatusIsReleased')
      .mapBy('course')
      .uniq()
      .rejectBy('releaseStatusIsDeprecated')
      .rejectBy('releaseStatusIsAlpha')
      .rejectBy('visibilityIsPrivate')
      .sortBy('sortPositionForTrack');
  }

  get releasedCourseExtensionIdeas() {
    return this.model.courseExtensionIdeas.filterBy('developmentStatusIsReleased');
  }

  get releasedCourseIdeas() {
    return this.model.courseIdeas.filterBy('developmentStatusIsReleased');
  }

  get selectedCourse() {
    return this.store.peekAll('course').findBy('slug', this.selectedCourseSlug);
  }

  @action
  handleCourseChange(course: CourseModel) {
    this.selectedCourseSlug = course.slug;
  }
}
