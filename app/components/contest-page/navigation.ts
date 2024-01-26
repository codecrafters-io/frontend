import Component from '@glimmer/component';
import ContestModel from 'codecrafters-frontend/models/contest';
import DateService from 'codecrafters-frontend/services/date';
import { inject as service } from '@ember/service';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    allContests: ContestModel[];
    contest: ContestModel;
  };
};

export default class ContestPageNavigationComponent extends Component<Signature> {
  @service declare date: DateService;

  get currentContestIndex(): number {
    return this.sortedContests.indexOf(this.args.contest);
  }

  get isNextContestDisabled(): boolean {
    return !this.nextContest;
  }

  get isPreviousContestDisabled(): boolean {
    return !this.previousContest;
  }

  get nextContest(): ContestModel | null {
    if (this.currentContestIndex < this.sortedContests.length - 1) {
      const nextContest = this.sortedContests[this.currentContestIndex + 1] as ContestModel;
      const oneWeekFromNow = new Date(this.date.now() + 7 * 24 * 60 * 60 * 1000);

      if (nextContest.startsAt < oneWeekFromNow) {
        return nextContest;
      } else {
        return null
      }
    } else {
      return null;
    }
  }

  get previousContest(): ContestModel | null {
    if (this.currentContestIndex > 0) {
      return this.sortedContests[this.currentContestIndex - 1] as ContestModel;
    } else {
      return null;
    }
  }

  get sortedContests(): ContestModel[] {
    return this.args.allContests.sortBy('startsAt');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ContestPage::Navigation': typeof ContestPageNavigationComponent;
  }
}
