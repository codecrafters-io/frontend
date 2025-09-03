import Component from '@glimmer/component';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { inject as service } from '@ember/service';
import type CourseModel from 'codecrafters-frontend/models/course';

interface Signature {
  Element: HTMLTableRowElement;

  Args: {
    entry: LeaderboardEntryModel;
    index: number;
  };
}

const MAX_VISIBLE_COURSES = 7;

export default class LeaderboardPageEntriesTableRow extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get isCurrentUser(): boolean {
    return this.args.entry.user === this.authenticator.currentUser;
  }

  get visibleCourses(): CourseModel[] {
    return this.args.entry.relatedCourses.slice(-MAX_VISIBLE_COURSES);
  }

  get hiddenCourses(): CourseModel[] {
    return this.args.entry.relatedCourses.slice(0, -MAX_VISIBLE_COURSES);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'LeaderboardPage::EntriesTable::Row': typeof LeaderboardPageEntriesTableRow;
  }
}
