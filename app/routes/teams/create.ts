import { service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import type Store from '@ember-data/store';
import type TeamModel from 'codecrafters-frontend/models/team';

export interface ModelType {
  currentTeams: TeamModel[];
}

export default class TeamsCreateRoute extends BaseRoute {
  @service declare store: Store;

  activate() {
    scrollToTop();
  }

  async model(): Promise<ModelType> {
    const teams = (await this.store.findAll('team', { include: 'memberships.user,subscriptions' })) as unknown as TeamModel[];

    return { currentTeams: teams };
  }
}
