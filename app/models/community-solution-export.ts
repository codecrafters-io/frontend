import Model, { attr, belongsTo } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';
import type CommunityCourseStageSolutionModel from './community-course-stage-solution';

export default class CommunitySolutionExportModel extends Model {
  @belongsTo('community-course-stage-solution', { async: false, inverse: 'exports' })
  declare communitySolution: CommunityCourseStageSolutionModel;

  @attr('string') declare status: 'provisioning' | 'provisioned';
  @attr('date') declare lastAccessedAt: Date;
  @attr('string') declare humanId: string;
  @attr('boolean') declare expired: boolean;
  @attr('string') declare githubRepositoryUrl: string | null;


  get isProvisioned(): boolean {
    return this.status === 'provisioned';
  }

  githubUrlForFile(filename: string): string | null {
    if (!this.githubRepositoryUrl) {
      return null;
    }

    return `${this.githubRepositoryUrl}/blob/main/${filename}`;
  }

  declare markAsAccessed: (this: Model, payload?: any) => Promise<void>;
}

CommunitySolutionExportModel.prototype.markAsAccessed = memberAction({
  path: 'mark-as-accessed',
  type: 'post',
});
