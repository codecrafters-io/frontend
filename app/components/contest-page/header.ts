import Component from '@glimmer/component';
import ContestModel from 'codecrafters-frontend/models/contest';
import { format, formatDistanceStrict } from 'date-fns';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    contest: ContestModel;
  };
};

export default class ContestPageHeaderComponent extends Component<Signature> {
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
      return `${formatDistanceStrict(new Date(), this.args.contest.startsAt)} left`;
    }
  }

  get contestStatusPillTooltipCopy(): string {
    if (this.args.contest.hasNotStarted) {
      return `This contest will start at 12:00 AM UTC on ${format(this.args.contest.startsAt, 'd MMMM yyyy')}`;
    } else if (this.args.contest.hasEnded) {
      return `This contest ended at 12:00 AM UTC on ${format(this.args.contest.endsAt, 'd MMMM yyyy')}`;
    } else {
      return `This contest will end at 12:00 AM UTC on ${format(this.args.contest.endsAt, 'd MMMM yyyy')}`;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ContestPage::Header': typeof ContestPageHeaderComponent;
  }
}
