import { action } from '@ember/object';
import { next } from '@ember/runloop';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type SolutionComparisonModel from 'codecrafters-frontend/models/solution-comparison';
import type UserModel from 'codecrafters-frontend/models/user';

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    comparison: SolutionComparisonModel;
    firstUser: UserModel;
  };
};

export default class ComparisonCard extends Component<Signature> {
  @tracked isExpanded = false;

  get firstUser() {
    return this.args.firstUser;
  }

  get isCollapsed() {
    return !this.isExpanded;
  }

  get result() {
    if (this.args.comparison.firstSolution.user.id === this.args.firstUser.id) {
      return this.args.comparison.result;
    } else {
      return {
        first_wins: 'second_wins',
        second_wins: 'first_wins',
        tie: 'tie',
      }[this.args.comparison.result];
    }
  }

  get secondUser() {
    if (this.args.comparison.firstSolution.user.id === this.args.firstUser.id) {
      return this.args.comparison.secondSolution.user;
    } else {
      return this.args.comparison.firstSolution.user;
    }
  }

  get solutionForFirstUser() {
    if (this.args.comparison.firstSolution.user.id === this.firstUser.id) {
      return this.args.comparison.firstSolution;
    } else {
      return this.args.comparison.secondSolution;
    }
  }

  get solutionForSecondUser() {
    if (this.args.comparison.firstSolution.user.id === this.secondUser.id) {
      return this.args.comparison.firstSolution;
    } else {
      return this.args.comparison.secondSolution;
    }
  }

  @action
  handleCollapseButtonClick() {
    next(() => {
      this.isExpanded = false;
    });
  }

  @action
  handleCopyIdToClipbardButtonClick() {
    navigator.clipboard.writeText(this.args.comparison.id);
  }

  @action
  handleExpandButtonClick() {
    next(() => {
      this.isExpanded = true;
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExamplePage::ComparisonCard': typeof ComparisonCard;
  }
}
