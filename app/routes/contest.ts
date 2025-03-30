import type Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import type ContestModel from 'codecrafters-frontend/models/contest';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';

export type ModelType = {
  contest: ContestModel;
  allContests: ContestModel[];
  topLeaderboardEntries: LeaderboardEntryModel[];
  surroundingLeaderboardEntries: LeaderboardEntryModel[];
  languages: LanguageModel[];
};

export default class ContestRoute extends BaseRoute {
  afterModel(model: ModelType): void {
    if (!model || !model.contest) {
      this.router.transitionTo('not-found');
    }
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Dark });
  }

  @service declare router: RouterService;
  @service declare store: Store;

  async model(params: { contest_slug: string }) {
    const allContests = (await this.store.query('contest', { include: 'leaderboard' })) as unknown as ContestModel[];

    const contest = allContests.find((contest) => contest.slug === params.contest_slug) as ContestModel;

    if (!contest) {
      return {
        contest: null,
        allContests: [],
        topLeaderboardEntries: [],
        surroundingLeaderboardEntries: [],
        languages: [],
      } as unknown as ModelType;
    }

    const topLeaderboardEntries = (await this.store.query('leaderboard-entry', {
      leaderboard_id: contest.leaderboard.id,
      include: 'user,leaderboard',
    })) as unknown as LeaderboardEntryModel[];

    let surroundingLeaderboardEntries: LeaderboardEntryModel[] = [];

    if (this.authenticator.isAuthenticated) {
      surroundingLeaderboardEntries = (await this.store.query('leaderboard-entry', {
        leaderboard_id: contest.leaderboard.id,
        include: 'leaderboard,user',
        filter_type: 'around_me',
      })) as unknown as LeaderboardEntryModel[];
    }

    const languages = (await this.store.findAll('language')) as unknown as LanguageModel[];

    return {
      contest,
      allContests,
      topLeaderboardEntries,
      surroundingLeaderboardEntries,
      languages,
    } as ModelType;
  }
}
