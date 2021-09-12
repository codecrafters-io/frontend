import { create, visitable } from 'ember-cli-page-object';
import SetupItem from 'codecrafters-frontend/tests/pages/components/course-page/step-list/setup-item';
import CourseStageItem from 'codecrafters-frontend/tests/pages/components/course-page/step-list/course-stage-item';
import RepositoryDropdown from 'codecrafters-frontend/tests/pages/components/course-page/repository-dropdown';

export default create({
  setupItem: SetupItem,
  visit: visitable('/courses/next/:course_slug'),
  activeCourseStageItem: CourseStageItem,

  get courseStageItemIsActive() {
    return this.activeCourseStageItem.isVisible;
  },

  repositoryDropdown: RepositoryDropdown,

  get setupItemIsActive() {
    return this.setupItem.isVisible;
  },
});
