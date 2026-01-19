import Component from '@glimmer/component';
import type LanguageModel from 'codecrafters-frontend/models/language';

interface Signature {
  Element: HTMLTableRowElement;

  Args: {
    language: LanguageModel;
  };
}

export default class LeaderboardPageEntriesTableHeaderRow extends Component<Signature> {
  get explanationMarkdownForScore() {
    return `
The highest possible score for this track is ${this.args.language.leaderboard!.highestPossibleScore}.

Harder stages have higher scores assigned to them.
`.trim();
  }

  get explanationMarkdownForStagesCompleted() {
    return `There are ${this.args.language.liveOrBetaStagesCount} stages available in this track.`;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'LeaderboardPage::EntriesTable::HeaderRow': typeof LeaderboardPageEntriesTableHeaderRow;
  }
}
