import Model, { attr, belongsTo } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';

export default class CourseTesterVersionModel extends Model {
  @belongsTo('course', { async: false, inverse: 'testerVersions' }) declare course: { slug: string };
  @belongsTo('user', { async: false, inverse: null }) declare activator: unknown;

  @attr('string') declare commitSha: string;
  @attr('date') declare createdAt: Date;
  @attr('date') declare lastActivatedAt?: Date;
  @attr('boolean') declare isLatest: boolean;
  @attr('boolean') declare isActive: boolean;
  @attr('string') declare tagName: string;

  declare activate: (this: Model, payload: unknown) => Promise<void>;
}

CourseTesterVersionModel.prototype.activate = memberAction({
  path: 'activate',
  type: 'post',

  after(response) {
    this.store.pushPayload(response);
  },
});
