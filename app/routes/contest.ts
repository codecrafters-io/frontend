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
    const contest = allContests.find((contest) => contest.slug === params.contest_slug);

    return {
      contest,
      allContests,
    };
  }
}
