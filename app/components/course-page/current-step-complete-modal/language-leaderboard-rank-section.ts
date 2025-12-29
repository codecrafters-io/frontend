import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type LeaderboardEntriesCacheRegistryService from 'codecrafters-frontend/services/leaderboard-entries-cache-registry';
import type LeaderboardEntriesCache from 'codecrafters-frontend/utils/leaderboard-entries-cache';
import type Owner from '@ember/owner';
import type RouterService from '@ember/routing/router-service';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    language: LanguageModel;
  };
}

export default class LanguageLeaderboardRankSection extends Component<Signature> {
  transition = fade;

  @service declare leaderboardEntriesCacheRegistry: LeaderboardEntriesCacheRegistryService;
  @service declare router: RouterService;

  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args);

    this.refreshRankTask.perform();
  }

  get leaderboardEntriesCache(): LeaderboardEntriesCache {
    return this.leaderboardEntriesCacheRegistry.getOrCreate(this.args.language.leaderboard!);
  }

  get userRank(): number | undefined {
    return this.leaderboardEntriesCache.userRankCalculation?.rank;
  }

  @action
  handleClick() {
    window.open(this.router.urlFor('leaderboard', this.args.language.slug), '_blank');
  }

  refreshRankTask = task({ restartable: true }, async () => {
    await this.leaderboardEntriesCacheRegistry.getOrCreate(this.args.language.leaderboard!).loadOrRefresh();
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CurrentStepCompleteModal::LanguageLeaderboardRankSection': typeof LanguageLeaderboardRankSection;
  }
}
