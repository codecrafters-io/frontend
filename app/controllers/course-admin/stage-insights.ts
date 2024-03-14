import Controller from '@ember/controller';
import type { ModelType } from 'codecrafters-frontend/routes/course-admin/stage-insights';

export default class StageInsightsController extends Controller {
  declare model: ModelType;

  get participationAnalysis() {
    return this.model.stage.participationAnalysis!;
  }

  get sortedDroppedOffParticipations() {
    return this.model.stage.participations
      .filter((participation) => participation.status === 'dropped_off')
      .sortBy('lastAttemptAt')
      .reverse();
  }
}
