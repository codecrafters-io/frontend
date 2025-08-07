import ApplicationAdapter from './application';
import type { Snapshot } from '@ember-data/store';

export default class CommunitySolutionExportAdapter extends ApplicationAdapter {
  // @ts-expect-error - Override with correct typing
  urlForCreateRecord(_modelName: string, snapshot: Snapshot) {
    const communitySolutionId = snapshot.attr('community_solution_id') || snapshot.belongsTo('communitySolution')?.id;

    return `${this.buildURL()}/community-solution-exports?community_solution_id=${communitySolutionId}`;
  }
}
