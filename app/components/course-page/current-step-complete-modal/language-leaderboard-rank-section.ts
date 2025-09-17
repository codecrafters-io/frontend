import { service } from '@ember/service';
import Component from '@glimmer/component';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type Store from '@ember-data/store';
import type LeaderboardRankCalculationModel from 'codecrafters-frontend/models/leaderboard-rank-calculation';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import fade from 'ember-animated/transitions/fade';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    language: LanguageModel;
  };
}

export default class LanguageLeaderboardRankSection extends Component<Signature> {
  transition = fade;

  @service declare store: Store;

  @tracked userRankCalculation: LeaderboardRankCalculationModel | null = null;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    this.loadUserRankCalculationTask.perform();
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
