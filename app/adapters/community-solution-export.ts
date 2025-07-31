import ApplicationAdapter from './application';
import type { Snapshot } from '@ember-data/store';

export default class CommunitySolutionExportAdapter extends ApplicationAdapter {
  // @ts-expect-error - Override with correct typing for nested resource
  urlForFindRecord(id: string, modelName: string, snapshot: Snapshot) {
    let solutionId: string | undefined;

    // First try to get from adapter options
    if (snapshot.adapterOptions && 'solutionId' in snapshot.adapterOptions) {
      solutionId = snapshot.adapterOptions['solutionId'] as string;
    }
    // Fallback to relationship if available
    else {
      const communitySolution = snapshot.belongsTo('communitySolution');
      solutionId = communitySolution?.id;
    }

    if (solutionId) {
      return `${this.buildURL()}/community-course-stage-solutions/${solutionId}/github-exports/${id}`;
    }

    return super.urlForFindRecord(id, modelName, snapshot);
  }
}
