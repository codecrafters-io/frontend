import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type CourseIdeaModel from 'codecrafters-frontend/models/course-idea';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export default class CourseIdeasController extends Controller {
  @service declare authenticator: AuthenticatorService;

  declare model: {
    courseIdeas: CourseIdeaModel[];
  };

  get dummyReleases() {
    return [
      {
        title: 'Build your own Redis',
        date: 'Jun 2025',
        type: 'challenge',
      },
      {
        title: 'Geospatial commands for Redis',
        date: 'Jun 2025',
        type: 'extension',
      },
      {
        title: 'File search for grep',
        date: 'May 2025',
        type: 'extension',
      },
      {
        title: 'Pub/Sub for Redis',
        date: 'May 2025',
        type: 'extension',
      },
      {
        title: 'Streams for Redis',
        date: 'Apr 2025',
        type: 'extension',
      },
    ];
  }

  get orderedCourseIdeas() {
    return this.model.courseIdeas.rejectBy('isArchived').rejectBy('developmentStatusIsReleased').sortBy('reverseSortPositionForVotePage').reverse();
  }
}
