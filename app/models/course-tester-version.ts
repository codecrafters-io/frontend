import Model, { attr, belongsTo } from '@ember-data/model';

export default class CourseTesterVersionModel extends Model {
  @belongsTo('course', { async: false }) declare course: { slug: string };
  @belongsTo('user', { async: false }) declare activator: unknown;

  @attr('string') declare commitSha: string;
  @attr('date') declare createdAt: Date;
  @attr('date') declare lastActivatedAt?: Date;
  @attr('string') declare isLatest: boolean;
  @attr('string') declare isActive: boolean;
  @attr('string') declare name: string;
}
