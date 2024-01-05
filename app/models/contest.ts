import Model, { attr, belongsTo } from '@ember-data/model';
import type LeaderboardModel from './leaderboard';

export default class ContestModel extends Model {
  @belongsTo('leaderboard', { async: false, inverse: 'contest' }) declare leaderboard: LeaderboardModel;

  @attr('string') declare name: string;
  @attr('string') declare slug: string;
  @attr('date') declare startsAt: Date;
  @attr('date') declare endsAt: Date;
  @attr('string') declare type: string;

  get instructionsMarkdown(): string {
    // TODO: We'll need to change this for non-weekly contests in the future
    return `
1. When you pass any stage in a CodeCrafters challenge, you automatically become eligible to
win the prize for the ongoing contest. There is no separate registration required.

2. Passing each new stage automatically adds points to your score. The number of points awarded depends on the difficulty of the stage:
  - Very Easy: 5 points
  - Easy: 15 points
  - Medium: 30 points
  - Hard: 50 points

3. Points are only awarded once per unique stage, regardless of language. If you have passed the same stage before, you won't accrue points.

4. Points reset once the ongoing contest ends.

5. When your score is in the Top 15 for the week, your progress and score will be highlighted on the leaderboard.

6. At the end of the contest, the developer with the top score wins the prize. In the event of a tie, the winner will be chosen randomly.

7. CodeCrafters has rigorous checks in place for detecting plagiarism and other malicious tactics. Any such activity will result in a 1 year ban from Contests.
    `;
  }

  get prizeDetailsMarkdown(): string {
    return `
**This week's prize: [ZSA Moonlander](https://www.zsa.io/moonlander/)**.

Beyond a keyboard: a commitment to efficiency and well-being.
    `;
  }
}
