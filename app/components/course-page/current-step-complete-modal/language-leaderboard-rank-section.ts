import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type LeaderboardRankCalculationModel from 'codecrafters-frontend/models/leaderboard-rank-calculation';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    language: LanguageModel;
  };
}

export default class LanguageLeaderboardRankSection extends Component<Signature> {
  transition = fade;

  @service declare store: Store;
  @service declare router: RouterService;

  @tracked userRankCalculation: LeaderboardRankCalculationModel | null = null;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    this.loadUserRankCalculationTask.perform();
  }

  @action
  handleClick() {
    window.open(this.router.urlFor('leaderboard', this.args.language.slug), '_blank');
  }

  loadUserRankCalculationTask = task({ restartable: true }, async () => {
    this.userRankCalculation = await this.store
      .createRecord('leaderboard-rank-calculation', {
        leaderboard: this.args.language.leaderboard!,
      })
      .save();
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CurrentStepCompleteModal::LanguageLeaderboardRankSection': typeof LanguageLeaderboardRankSection;
  }
}
