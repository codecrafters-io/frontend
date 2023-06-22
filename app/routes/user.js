import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class UserRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;
  @service authenticator;
  @service router;
  @service store;

  async model(params) {
    const users = await this.store.query('user', {
      username: params.username,
      include: 'course-participations.language,course-participations.course.stages,course-participations.current-stage,profile-events',
    });

    return users.firstObject;
  }
}
