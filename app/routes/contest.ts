import type Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import type ContestModel from 'codecrafters-frontend/models/contest';
import BaseRoute from 'codecrafters-frontend/utils/base-route';

export type ModelType = {
  contest: ContestModel;
  contests: ContestModel[];
};

export default class ContestRoute extends BaseRoute {
  allowsAnonymousAccess = true;

  @service declare router: RouterService;
  @service declare store: Store;

  async model(params: { contest_slug: string }) {
    const allContests = (await this.store.findAll('contest')) as unknown as ContestModel[];

    // TODO: Handle case where contest is not found
    const contest = await this.store.findRecord('contest', params.contest_slug, {
      include: 'leaderboard,leaderboard.entries,leaderboard.entries.user',
    });

    return {
      contest,
      allContests,
    };
  }
}
