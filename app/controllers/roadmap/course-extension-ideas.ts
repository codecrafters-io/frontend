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
    return this.model.courseExtensionIdeas.filterBy('course', this.selectedCourse).sortBy('reverseSortPositionForRoadmapPage').reverse();
  }

  get orderedCourses() {
    return this.model.courseExtensionIdeas
      .mapBy('course')
      .uniq()
      .filter((course) => {
        // Check if this course has any extension ideas with status "not_started" or "in_progress"
        const courseExtensionIdeas = this.model.courseExtensionIdeas.filterBy('course', course);

        return courseExtensionIdeas.some((idea) => idea.developmentStatusIsNotStarted || idea.developmentStatusIsInProgress);
      })
      .rejectBy('releaseStatusIsDeprecated')
      .rejectBy('releaseStatusIsAlpha')
      .rejectBy('visibilityIsPrivate')
      .sortBy('sortPositionForTrack');
  }

  get selectedCourse() {
    return this.store.peekAll('course').findBy('slug', this.selectedCourseSlug);
  }
}
