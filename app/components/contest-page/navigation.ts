import Component from '@glimmer/component';
import ContestModel from 'codecrafters-frontend/models/contest';
import DateService from 'codecrafters-frontend/services/date';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    allContests: ContestModel[];
    contest: ContestModel;
  };
}

export default class ContestPageNavigationComponent extends Component<Signature> {
  @service declare date: DateService;

  get currentContestIndex(): number {
    return this.sortedNavigableContests.indexOf(this.args.contest);
  }

  get isNextContestDisabled(): boolean {
    return !this.nextContest;
  }

  get isPreviousContestDisabled(): boolean {
    return !this.previousContest;
  }

  get navigableContests(): ContestModel[] {
    return this.args.allContests.filter((contest) => contest.slugPrefix === this.args.contest.slugPrefix);
  }

  get nextContest(): ContestModel | null {
    return this.sortedNavigableContests[this.currentContestIndex + 1] || null;
  }

  get previousContest(): ContestModel | null {
    if (this.currentContestIndex > 0) {
      return this.sortedNavigableContests[this.currentContestIndex - 1] || null;
    } else {
      return null;
    }
  }

  get sortedNavigableContests(): ContestModel[] {
    return this.navigableContests.sortBy('startsAt');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ContestPage::Navigation': typeof ContestPageNavigationComponent;
  }
}
