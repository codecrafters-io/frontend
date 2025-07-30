import ApplicationAdapter from './application';

export default class CommunitySolutionExportAdapter extends ApplicationAdapter {
  urlForFindRecord(id: string, modelName: any, snapshot: any): string {
    let solutionId: string | undefined;
    
    // First try to get from adapter options
    if (snapshot && snapshot.adapterOptions?.solutionId) {
      solutionId = snapshot.adapterOptions.solutionId;
    }
    // Fallback to relationship if available
    else if (snapshot) {
      const communitySolution = snapshot.belongsTo('communitySolution');
      solutionId = communitySolution?.id;
    }
    
    if (solutionId) {
      return `${this.buildURL()}/community-course-stage-solutions/${solutionId}/github-exports/${id}`;
    }
    
    return super.urlForFindRecord(id, modelName, snapshot);
  }
}