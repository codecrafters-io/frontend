import { create, visitable } from 'ember-cli-page-object';
import SetupItem from 'codecrafters-frontend/tests/pages/components/course-page/step-list/setup-item';
import CourseStageItem from 'codecrafters-frontend/tests/pages/components/course-page/step-list/course-stage-item';
import RepositoryDropdown from 'codecrafters-frontend/tests/pages/components/course-page/repository-dropdown';
import Leaderboard from 'codecrafters-frontend/tests/pages/components/course-page/leaderboard';

export default create({
  activeCourseStageItem: CourseStageItem,

  get courseStageItemIsActive() {
    return this.activeCourseStageItem.isVisible;
  },

  leaderboard: Leaderboard,
  repositoryDropdown: RepositoryDropdown,
  setupItem: SetupItem,

  get setupItemIsActive() {
    return this.setupItem.isVisible;
  },

  visit: visitable('/courses/next/:course_slug'),
});
