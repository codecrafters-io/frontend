import Service, { inject as service } from '@ember/service';
import LocalStorageService from 'codecrafters-frontend/services/local-storage';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type AuthenticatorService from './authenticator';
import LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import type Store from '@ember-data/store';

class StoredData {
  languageSlugs: string[];
  storedAt: Date;

  constructor(languageSlugs: string[], storedAt?: Date) {
    this.languageSlugs = languageSlugs;
    this.storedAt = storedAt || new Date();
  }

  static fromJSON(json: string): StoredData {
    const { languageSlugs, storedAt } = JSON.parse(json);

    return new StoredData(languageSlugs, storedAt);
  }

  toJSON(): string {
    return JSON.stringify({
      languageSlugs: this.languageSlugs,
      storedAt: this.storedAt,
    });
  }
}

export default class PreferredLanguageLeaderboardService extends Service {
  static STORAGE_KEY = 'preferred-language-leaderboard-v1';

  @service declare authenticator: AuthenticatorService;
  @service declare localStorage: LocalStorageService;
  @service declare store: Store;

  // We default to Rust since it's the first track in the catalog
  @tracked preferredLanguageSlugs: string[] = [];

  // This is used when a user clicks on the Leaderboard link in the header
  get defaultLanguageSlug(): string {
    return this.preferredLanguageSlugs[0] || 'rust';
  }

  @action
  async onBoot(): Promise<void> {
    if (!this.authenticator.isAuthenticated) {
      return;
    }

    const serializedStoredData = this.localStorage.getItem(PreferredLanguageLeaderboardService.STORAGE_KEY);

    if (!serializedStoredData) {
      return;
    }

    // Let's use the latest value we have from
    const storedData = StoredData.fromJSON(serializedStoredData);
    this.preferredLanguageSlugs = storedData.languageSlugs;

    // Re-fetch if data is more than 6 hours old
    if (storedData.storedAt.getTime() < Date.now() - 1000 * 60 * 60 * 6) {
      await this.refresh();
    }
  }

  async refresh(): Promise<void> {
    await this.authenticator.authenticate();

    const userLeaderboardEntries = (await this.store
      .createRecord('leaderboard-entry')
      .fetchForCurrentUser({ include: 'leaderboard,leaderboard.language,user' })) as unknown as LeaderboardEntryModel[];

    this.preferredLanguageSlugs = userLeaderboardEntries
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.leaderboard.language.slug)
      .slice(0, 3);

    this.localStorage.setItem(PreferredLanguageLeaderboardService.STORAGE_KEY, new StoredData(this.preferredLanguageSlugs, new Date()).toJSON());
  }
}
