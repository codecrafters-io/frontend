import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';

export default class UserRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service authenticator;
  @service router;
  @service store;

  afterModel(model) {
    if (!model) {
      this.router.transitionTo('not-found');
    }
  }

  async model(params) {
    const users = await this.store.query('user', {
      username: params.username,
      include: 'course-participations.language,course-participations.course.stages,course-participations.current-stage,profile-events',
    });

    return users[0];
  }
}
