import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class UserRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;
  @service currentUser;
  @service router;
  @service store;

  async model(params) {
    const users = await this.store.query('user', {
      username: params.username,
      include: 'course-participations.language,course-participations.course.stages,course-participations.current-stage,profile-events',
    });

    return users.firstObject;
  }

  afterModel(model) {
    if (!model || model.courseParticipations.length === 0) {
      // TODO: Find out why this doesn't work!
      this.router.replaceWith('not-found');
    }
  }
}
