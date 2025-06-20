import Model, { attr, belongsTo } from '@ember-data/model';
import type CommunityCourseStageSolutionModel from './community-course-stage-solution';

export default class CommunitySolutionExportModel extends Model {
  static modelName = 'community-solution-export';
  @belongsTo('community-course-stage-solution', { async: false, inverse: 'exports' })
  declare communitySolution: CommunityCourseStageSolutionModel;

  @attr('string') declare baseUrl: string;
  @attr('date') declare expiresAt: Date;
  @attr('string') declare status: 'provisioned' | 'provisioning';

  get isExpired(): boolean {
    if (!this.expiresAt) return false;

    return new Date() > this.expiresAt;
  }

  get isProvisioned(): boolean {
    return this.status === 'provisioned';
  }

  get isProvisioning(): boolean {
    return this.status === 'provisioning';
  }
}
