import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import scrollToTop from 'codecrafters-frontend/lib/scroll-to-top';

export default class TeamsCreateRoute extends ApplicationRoute {
  @service store;

  activate() {
    scrollToTop();
  }

  async model() {
    const teams = await this.store.findAll('team', { include: 'memberships.user,subscriptions' });

    return { currentTeams: teams };
  }
}
