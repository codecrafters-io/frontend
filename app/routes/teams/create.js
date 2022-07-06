import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class TeamsCreateRoute extends ApplicationRoute {
  @service store;

  activate() {
    window.scrollTo({ top: 0 });
  }

  async model() {
    const teams = await this.store.findAll('team', { include: 'memberships.user,subscriptions' });

    return { currentTeams: teams };
  }
}
