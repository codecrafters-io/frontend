import ApplicationAdapter from './application';
import type { Snapshot } from '@ember-data/store';

export default class LeaderboardEntryAdapter extends ApplicationAdapter {
  buildQuery(snapshot: Snapshot) {
    const query = super.buildQuery(snapshot);

    if ('leaderboard_id' in (snapshot.adapterOptions || {})) {
      query['leaderboard_id'] = snapshot.adapterOptions['leaderboard_id'];
    }

    if ('filter_type' in (snapshot.adapterOptions || {})) {
      query['filter_type'] = snapshot.adapterOptions['filter_type'];
    }

    return query;
  }
}
