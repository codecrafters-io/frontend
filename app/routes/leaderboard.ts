import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type LeaderboardModel from 'codecrafters-frontend/models/leaderboard';
import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';

export type ModelType = {
  language: LanguageModel;
  leaderboard: LeaderboardModel;
  topLeaderboardEntries: LeaderboardEntryModel[];
};

export default class LeaderboardRoute extends BaseRoute {
  allowsAnonymousAccess = true;

  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  activate(): void {
    scrollToTop();
  }

  async model(params: { language_slug: string }): Promise<ModelType> {
    (await this.store.findAll('course', {
      include: 'extensions,stages,language-configurations.language',
    })) as unknown as CourseModel[];

    const languages = (await this.store.findAll('language', {
      include: 'leaderboard,primer-concept-group,primer-concept-group.author,primer-concept-group.concepts,primer-concept-group.concepts.author',
      reload: true,
    })) as unknown as LanguageModel[];

    const language = languages.find((language) => language.slug === params.language_slug)!;

    const topLeaderboardEntries = (await this.store.query('leaderboard-entry', {
      include: 'leaderboard,user',
      leaderboard_id: language.leaderboard!.id,
      filter_type: 'top',
    })) as unknown as LeaderboardEntryModel[];

    return {
      language: language,
      leaderboard: language.leaderboard!,
      topLeaderboardEntries: topLeaderboardEntries,
    };
  }
}
