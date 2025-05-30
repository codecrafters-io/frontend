import ApplicationAdapter from './application';

export default class CommunityCourseStageSolutionAdapter extends ApplicationAdapter {
  namespace = 'api/v1';

  pathForType() {
    return 'community-course-stage-solutions/for-admin';
  }
}
