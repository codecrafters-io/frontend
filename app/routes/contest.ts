import type Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import type MetaDataService from 'codecrafters-frontend/services/meta-data';
import ContestModel from 'codecrafters-frontend/models/contest';
import LanguageModel from 'codecrafters-frontend/models/language';
import LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import type Transition from '@ember/routing/transition';
import type ContestController from 'codecrafters-frontend/controllers/contest';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export type ContestRouteModel = {
  contest: ContestModel;
  allContests: ContestModel[];
  topLeaderboardEntries: LeaderboardEntryModel[];
  languages: LanguageModel[];
};

export default class ContestRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare metaData: MetaDataService;
  @service declare router: RouterService;
  @service declare store: Store;

  previousMetaImageUrl: string | undefined;
  previousMetaTitle: string | undefined;
  previousMetaDescription: string | undefined;

  afterModel(model: ContestRouteModel): void {
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
      case 'amazon-2':
        imageUrl = '/assets/images/contest-og-images/og-amazon-contest-2.png';
        title = 'CodeCrafters x Amazon';
        description = 'Compete in the second contest exclusively for Amazonians on CodeCrafters.';
        break;
      case 'cais-1':
        imageUrl = '/assets/images/contest-og-images/og-cais-contest-1.png';
        title = 'CodeCrafters x CAIS';
        description = 'Compete in the first ever contest exclusively for CAIS employees on CodeCrafters.';
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
    // First, try finding the contest already cached in the store
    let allContests = await this.store.findAll('contest', { include: 'leaderboard' });
    let contest = allContests.find((contest) => contest.slug === params.contest_slug);

    if (!contest) {
      // If no contest found, re-fetch contests and try again
      allContests = await this.store.findAll('contest', { include: 'leaderboard', reload: true });
      contest = allContests.find((contest) => contest.slug === params.contest_slug);

      // If still no contest found, return undefined
      if (!contest) {
        return {
          contest: undefined, // will redirect to 404 in afterModel
          allContests: [],
          topLeaderboardEntries: [],
          languages: [],
        };
      }
    }

    const topLeaderboardEntries = await this.store.findAll('leaderboard-entry', {
      adapterOptions: {
        leaderboard_id: contest.leaderboard.id,
      },
      include: 'user,leaderboard',
    });

    const languages = await this.store.findAll('language');

    return {
      contest,
      allContests,
      topLeaderboardEntries,
      languages,
    } as unknown as ContestRouteModel;
  }

  async setupController(controller: ContestController, model: ContestRouteModel, transition: Transition) {
    super.setupController(controller, model, transition);

    if (this.authenticator.isAuthenticated) {
      // Fetch real surroundingLeaderboardEntries and set them in the controller
      controller.surroundingLeaderboardEntries = (await this.store.query('leaderboard-entry', {
        include: 'leaderboard,user',
        leaderboard_id: model.contest.leaderboard.id,
        filter_type: 'around_me',
        user_id: this.authenticator.currentUserId, // Only used in tests since mirage doesn't have auth context
      })) as unknown as LeaderboardEntryModel[];
    }
  }
}
