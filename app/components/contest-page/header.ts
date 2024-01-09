import Component from '@glimmer/component';
import ContestModel from 'codecrafters-frontend/models/contest';
import { formatDistanceStrict } from 'date-fns';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    contest: ContestModel;
  };
};

export default class ContestPageHeaderComponent extends Component<Signature> {
  get statusPillColor(): 'gray' | 'green' {
    if (new Date() < this.args.contest.startsAt || new Date() > this.args.contest.endsAt) {
      return 'gray';
    } else {
      return 'green';
    }
  }

  get statusPillCopy(): string {
    if (new Date() < this.args.contest.startsAt) {
      return 'Not started';
    } else if (new Date() > this.args.contest.endsAt) {
      return 'Ended';
    } else {
      return `${formatDistanceStrict(new Date(), this.args.contest.startsAt)} left`
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ContestPage::Header': typeof ContestPageHeaderComponent;
  }
}
