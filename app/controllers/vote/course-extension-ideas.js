import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class CourseExtensionIdeasController extends Controller {
  queryParams = [
    {
      selectedCourseSlug: 'course',
    },
  ];

  @tracked selectedCourseSlug;

  @service authenticator;
  @service store;

  get orderedCourses() {
    return this.model.courseExtensionIdeas.mapBy('course').uniq().sortBy('sortPositionForTrack');
  }

  get orderedCourseExtensionIdeas() {
    return this.model.courseExtensionIdeas.filterBy('course', this.selectedCourse).sortBy('createdAt').reverse();
  }

  get selectedCourse() {
    return this.store.peekAll('course').findBy('slug', this.selectedCourseSlug);
  }
}
