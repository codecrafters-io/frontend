import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class CourseStageSolutionDiffRoute extends ApplicationRoute {
  @service store;

  afterModel(model) {
    this.store
      .createRecord('analytics-event', {
        name: 'viewed_course_stage_solution_diff',
        properties: {
          course_slug: model.courseStage.course.slug,
          course_stage_slug: model.courseStage.slug,
          language_slug: model.language.slug,
          requested_language_slug: this.paramsFor('course-stage-solution').requestedLanguageSlug || model.language.slug,
        },
      })
      .save();
  }
}
