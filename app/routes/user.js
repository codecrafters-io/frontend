import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class UserRoute extends ApplicationRoute {
  @service currentUser;
  @service store;

  async model(params) {
    const user = await this.store.query('user', {
      username: params.username,
      include: 'course-participations.language,course-participations.course.stages,course-participations.current-stage',
    });

    return { user: user };
  }

  afterModel(model) {
    if (model.user.courseParticipations.length === 0) {
      this.transitionTo('not-found');
    }
  }
}
