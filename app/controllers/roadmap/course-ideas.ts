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
    return this.model.courseIdeas
      .rejectBy('isArchived')
      .rejectBy('developmentStatusIsReleased')
      .sortBy('reverseSortPositionForRoadmapPage')
      .reverse();
  }

  get tempLatestReleases(): { title: string; timestampText: string; type: 'extension' | 'challenge' }[] {
    return [
      {
        title: 'Build your own Kafka',
        timestampText: 'Jun 2025',
        type: 'challenge',
      },
      {
        title: 'Redis / Lists',
        timestampText: 'Jun 2025',
        type: 'extension',
      },
      {
        title: 'Redis / PubSub',
        timestampText: 'May 2025',
        type: 'extension',
      },
      {
        title: 'Grep / File Search',
        timestampText: 'May 2025',
        type: 'extension',
      },
      {
        title: 'Grep / Backreferences',
        timestampText: 'May 2025',
        type: 'extension',
      },
    ];
  }
}
