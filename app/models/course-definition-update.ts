import Model, { attr, belongsTo } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';

export default class CourseDefinitionUpdateModel extends Model {
  @belongsTo('course', { async: false }) declare course: { slug: string };
  @belongsTo('user', { async: false, inverse: null }) declare applier: unknown;

  @attr('date') declare appliedAt?: Date;
  @attr('string') declare definitionFileContentsDiff: string;
  @attr('string') declare description?: string;
  @attr('string') declare lastErrorMessage?: string;
  @attr('date') declare lastSyncedAt?: Date;
  @attr('string') declare newCommitSha: string;
  @attr('string') declare newDefinitionFileContents: string;
  @attr('string') declare oldCommitSha?: string;
  @attr('string') declare oldDefinitionFileContents: string;
  @attr('string') declare status: 'pending' | 'applied';
  @attr('string') declare summary?: string;

  declare apply: (this: Model, payload: unknown) => Promise<void>;
}

CourseDefinitionUpdateModel.prototype.apply = memberAction({
  path: 'apply',
  type: 'post',

  after(response) {
    this.store.pushPayload(response);
  },
});
