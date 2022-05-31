import Controller from '@ember/controller';

export default class TrackController extends Controller {
  get sortedCourses() {
    return this.model.courses.sortBy('sortPositionForTrack');
  }
}
