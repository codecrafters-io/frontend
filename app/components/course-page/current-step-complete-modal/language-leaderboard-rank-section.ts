import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type LeaderboardEntriesCacheRegistryService from 'codecrafters-frontend/services/leaderboard-entries-cache-registry';
import type LeaderboardEntriesCache from 'codecrafters-frontend/utils/leaderboard-entries-cache';
import type Owner from '@ember/owner';
import type RouterService from '@ember/routing/router-service';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import computeLeaderboardCTA from 'codecrafters-frontend/utils/compute-leaderboard-cta';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentCourseStage: CourseStageModel;
    language: LanguageModel;
    repository: RepositoryModel;
    shouldShowCTA: boolean;
  };
}

export default class LanguageLeaderboardRankSection extends Component<Signature> {
  transition = fade;

  @service declare leaderboardEntriesCacheRegistry: LeaderboardEntriesCacheRegistryService;
  @service declare router: RouterService;

  @tracked isLoadingRank: boolean = true;
  @tracked ctaText: string = 'Loading...';

  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args);

    this.refreshRankTask.perform();
  }

  get computedCtaText(): string | null {
    if (!this.leaderboardEntriesCache.userEntry || !this.leaderboardEntriesCache.userRankCalculation) {
      return null;
    }

    return computeLeaderboardCTA(
      this.leaderboardEntriesCache.userEntry,
      this.leaderboardEntriesCache.userRankCalculation,
      this.args.repository,
      this.args.currentCourseStage,
    );
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await this.leaderboardEntriesCacheRegistry.getOrCreate(this.args.language.leaderboard!).loadOrRefresh();

    this.isLoadingRank = false;
    this.ctaText = ' '; // No break space

    await timeout(500);
    this.ctaText = 'Nice work!';

    if (this.computedCtaText) {
      await timeout(2500);
      this.ctaText = ' '; // No break space

      await timeout(500);
      this.ctaText = this.computedCtaText;
    }
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CurrentStepCompleteModal::LanguageLeaderboardRankSection': typeof LanguageLeaderboardRankSection;
  }
}
