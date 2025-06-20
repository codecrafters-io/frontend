import ApplicationAdapter from './application';

export default class CommunitySolutionExportAdapter extends ApplicationAdapter {
  urlForCreateRecord() {
    return `${this.buildURL()}/community-solution-exports`;
  }

  urlForUpdateRecord(id: string) {
    return `${this.buildURL()}/community-solution-exports/${id}/mark-as-accessed`;
  }
}
