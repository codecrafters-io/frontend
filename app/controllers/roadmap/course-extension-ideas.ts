import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import type CourseExtensionIdeaModel from 'codecrafters-frontend/models/course-extension-idea';
import type CourseIdeaModel from 'codecrafters-frontend/models/course-idea';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Store from '@ember-data/store';
import type CourseModel from 'codecrafters-frontend/models/course';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import uniqReducer from 'codecrafters-frontend/utils/uniq-reducer';

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
    return this.model.courseExtensionIdeas.filter((item) => item.course === this.selectedCourse).sort(fieldComparator('sortPositionForRoadmapPage'));
  }

  get orderedCourses() {
    return this.model.courseExtensionIdeas
      .filter((item) => !item.developmentStatusIsReleased)
      .map((item) => item.course)
      .reduce(uniqReducer(), [])
      .filter((item) => !item.releaseStatusIsDeprecated)
      .filter((item) => !item.releaseStatusIsAlpha)
      .filter((item) => !item.visibilityIsPrivate)
      .sort(fieldComparator('sortPositionForTrack'));
  }

  get selectedCourse() {
    return this.store.peekAll('course').find((item) => item.slug === this.selectedCourseSlug);
  }

  @action
  handleCourseChange(course: CourseModel) {
    this.selectedCourseSlug = course.slug;
  }
}
