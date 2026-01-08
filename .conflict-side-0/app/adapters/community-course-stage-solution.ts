import ApplicationAdapter from './application';

interface AdapterOptions {
  admin?: boolean;
}

interface QueryOptions {
  adapterOptions?: AdapterOptions;
}

export default class CommunityCourseStageSolutionAdapter extends ApplicationAdapter {
  urlForQuery(query: QueryOptions) {
    if (query.adapterOptions?.admin) {
      return `${this.buildURL()}/community-course-stage-solutions/for-admin`;
    }

    return this.buildURL('community-course-stage-solution');
  }
}
