import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class TeamRoute extends ApplicationRoute {
  @service authenticator;
  @service store;

  async model(params) {
    // reload true ensures that team memberships are loaded when a new team is created.
    const teams = await this.store.findAll('team', {
      include:
        'memberships.user,memberships.user.course-participations,memberships.user.course-participations.course,slack-integrations,subscriptions',
      reload: true,
    });

    return {
      allTeams: teams,
      team: this.store.peekRecord('team', params.team_id),
    };
  }
}
