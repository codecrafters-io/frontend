import { service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import type Store from '@ember-data/store';
import type TeamModel from 'codecrafters-frontend/models/team';

export interface ModelType {
  allTeams: TeamModel[];
  team: TeamModel | null;
}

export default class TeamRoute extends BaseRoute {
  @service declare store: Store;

  async model(params: { team_id: string }): Promise<ModelType> {
    // reload true ensures that team memberships are loaded when a new team is created.
    const teams = (await this.store.findAll('team', {
      include:
        'memberships.user,memberships.user.course-participations,memberships.user.course-participations.course,slack-integrations,subscriptions',
      reload: true,
    })) as unknown as TeamModel[];

    return {
      allTeams: teams as unknown as TeamModel[],
      team: this.store.peekRecord('team', params.team_id),
    };
  }
}
