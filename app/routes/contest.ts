import type Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import type MetaDataService from 'codecrafters-frontend/services/meta-data';
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
  @service declare metaData: MetaDataService;
  @service declare router: RouterService;
  @service declare store: Store;

  previousMetaImageUrl: string | undefined;
  previousMetaTitle: string | undefined;
  previousMetaDescription: string | undefined;

  afterModel(model: ModelType): void {
    if (!model || !model.contest) {
      this.router.transitionTo('not-found');

      return;
    }

    // Save previous OG meta tags
    this.previousMetaImageUrl = this.metaData.imageUrl;
    this.previousMetaTitle = this.metaData.title;
    this.previousMetaDescription = this.metaData.description;

    // Default values for contest meta tags
    let imageUrl = '/assets/images/contest-og-images/og-amazon-contest-1.png';
    let title = 'CodeCrafters Contests';
    let description = 'Compete in this contest only on CodeCrafters.';

    // Special cases
    switch (model.contest.slug) {
      case 'amazon-1':
        imageUrl = '/assets/images/contest-og-images/og-amazon-contest-1.png';
        title = 'CodeCrafters x Amazon';
        description = 'Compete in the first ever contest exclusively for Amazonians on CodeCrafters.';
        break;
      case 'github-1':
        imageUrl = '/assets/images/contest-og-images/og-amazon-contest-1.png';
        title = 'CodeCrafters x GitHub';
        description = 'Compete in the first ever contest exclusively for Hubbers on CodeCrafters.';
        break;
      case 'vercel-1':
        imageUrl = '/assets/images/contest-og-images/og-amazon-contest-1.png';
        title = 'CodeCrafters x Vercel';
        description = 'Compete in the first ever contest exclusively for Vercelians on CodeCrafters.';
        break;
    }

    // Override OG meta tags with contest-specific ones
    this.metaData.imageUrl = imageUrl;
    this.metaData.title = title;
    this.metaData.description = description;
  }

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ allowsAnonymousAccess: true, colorScheme: RouteColorScheme.Dark });
  }

  deactivate() {
    this.metaData.imageUrl = this.previousMetaImageUrl;
    this.metaData.title = this.previousMetaTitle;
    this.metaData.description = this.previousMetaDescription;
  }

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
