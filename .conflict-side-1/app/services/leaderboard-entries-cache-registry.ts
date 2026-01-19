import Service from '@ember/service';
import LeaderboardEntriesCache from 'codecrafters-frontend/utils/leaderboard-entries-cache';
import type LeaderboardModel from 'codecrafters-frontend/models/leaderboard';
import { getOwner, setOwner } from '@ember/owner';

export default class LeaderboardEntriesCacheRegistryService extends Service {
  caches: Map<string, LeaderboardEntriesCache> = new Map();

  getOrCreate(leaderboard: LeaderboardModel): LeaderboardEntriesCache {
    const existingCache = this.caches.get(leaderboard.id);

    if (existingCache) {
      return existingCache;
    }

    const newCache = new LeaderboardEntriesCache(leaderboard);
    setOwner(newCache, getOwner(this)!);
    this.caches.set(leaderboard.id, newCache);

    return newCache;
  }
}

declare module '@ember/service' {
  interface Registry {
    'leaderboard-entries-cache-registry': LeaderboardEntriesCacheRegistryService;
  }
}
