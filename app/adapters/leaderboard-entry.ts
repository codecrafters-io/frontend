import ApplicationAdapter from './application';
import type { Snapshot } from '@ember-data/store';

export default class LeaderboardEntryAdapter extends ApplicationAdapter {
  buildQuery(snapshot: Snapshot) {
    const query = super.buildQuery(snapshot);

    if ('leaderboard_id' in (snapshot.adapterOptions || {})) {
      query['leaderboard_id'] = snapshot.adapterOptions['leaderboard_id'];
    }

    return query;
  }
}
