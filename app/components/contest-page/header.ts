import Component from '@glimmer/component';
import ContestModel from 'codecrafters-frontend/models/contest';
import DateService from 'codecrafters-frontend/services/date';
import { formatDistanceStrict } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    allContests: ContestModel[];
    contest: ContestModel;
  };
}

export default class ContestPageHeader extends Component<Signature> {
  @service declare date: DateService;

  get contestStatusPillColor(): 'gray' | 'green' {
    if (this.args.contest.hasNotStarted || this.args.contest.hasEnded) {
      return 'gray';
    } else {
      return 'green';
    }
  }

  get contestStatusPillCopy(): string {
    if (this.args.contest.hasNotStarted) {
      return 'Not started';
    } else if (this.args.contest.hasEnded) {
      return 'Ended';
    } else {
      return `${formatDistanceStrict(new Date(this.date.now()), this.args.contest.endsAt)} left`;
    }
  }

  get contestStatusPillTooltipCopy(): string {
    if (this.args.contest.hasNotStarted) {
      return `This contest will start at 12:00 AM UTC on ${formatInTimeZone(this.args.contest.startsAt, 'UTC', 'd MMMM yyyy')}`;
    } else if (this.args.contest.hasEnded) {
      return `This contest ended at 12:00 AM UTC on ${formatInTimeZone(this.args.contest.endsAt, 'UTC', 'd MMMM yyyy')}`;
    } else {
      return `This contest will end at 12:00 AM UTC on ${formatInTimeZone(this.args.contest.endsAt, 'UTC', 'd MMMM yyyy')}`;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ContestPage::Header': typeof ContestPageHeader;
  }
}
