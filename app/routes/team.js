import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class TeamRoute extends ApplicationRoute {
  @service currentUser;
  @service store;

  async model(params) {
    const teams = await this.store.findAll('team', { include: 'memberships.user,subscriptions' });

    return {
      allTeams: teams,
      team: this.store.peekRecord('team', params.team_id),
    };
  }
}
