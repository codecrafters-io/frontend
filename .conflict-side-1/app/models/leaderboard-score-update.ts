import Model, { attr } from '@ember-data/model';

export default class LeaderboardScoreUpdateModel extends Model {
  @attr('number') declare delta: number;
  @attr('string') declare description: string;

  // @ts-expect-error: empty transform not supported
  @attr('') declare relatedCourseSlugs: string[];

  // @ts-expect-error: empty transform not supported
  @attr('') declare relatedLanguageSlugs: string[];

  @attr('date') declare triggeredAt: Date;

  get wasTriggeredInPastMonth(): boolean {
    return this.triggeredAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }
}
