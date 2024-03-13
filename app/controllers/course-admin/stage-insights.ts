import Controller from '@ember/controller';
import type { ModelType } from 'codecrafters-frontend/routes/course-admin/stage-insights';

export default class CourseTesterVersionsController extends Controller {
  declare model: ModelType;

  get participationAnalysis() {
    return this.model.stage.participationAnalysis!;
  }
}
