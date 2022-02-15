import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'codecrafters-frontend/lib/authenticated-route';

export default class TeamRoute extends AuthenticatedRoute {
  @service currentUser;
  @service store;

  async model(params) {
    await this.currentUser.authenticate();
    await this.store.findAll('team', { include: 'memberships.user' });

    return { team: this.store.peekRecord('team', params.team_id) };
  }
}
