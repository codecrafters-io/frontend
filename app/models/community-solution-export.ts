import Model, { attr, belongsTo } from '@ember-data/model';
import type CommunityCourseStageSolutionModel from './community-course-stage-solution';

export default class CommunitySolutionExportModel extends Model {
  @belongsTo('community-course-stage-solution', { async: false, inverse: 'exports' })
  declare communitySolution: CommunityCourseStageSolutionModel;

  @attr('string') declare status: 'provisioning' | 'provisioned';
  @attr('date') declare lastAccessedAt: Date;
  @attr('string') declare humanId: string;
  @attr('boolean') declare expired: boolean;
  @attr('string') declare repositoryUrl: string | null;

  get isExpired(): boolean {
    return this.expired;
  }

  get isProvisioned(): boolean {
    return this.status === 'provisioned';
  }

  githubUrlForFile(filename: string): string | null {
    if (!this.repositoryUrl) {
      return null;
    }

    return `${this.repositoryUrl}/blob/main/${filename}`;
  }
}
