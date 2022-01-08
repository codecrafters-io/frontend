import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class TeamRoute extends Route {
  @service currentUser;
  @service store;

  async model(params) {
    await this.currentUser.authenticate();
    await this.store.findAll('team', { include: 'memberships.user' });

    return { team: this.store.peekRecord('team', params.team_id) };
  }
}
