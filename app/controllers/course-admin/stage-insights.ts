import Controller from '@ember/controller';
import type { ModelType } from 'codecrafters-frontend/routes/course-admin/stage-insights';

export default class StageInsightsController extends Controller {
  declare model: ModelType;

  get participationAnalysis() {
    return this.model.stage.participationAnalysis!;
  }

  get sortedActiveParticipations() {
    return this.model.stage.participations
      .filter((participation) => participation.status === 'active')
      .sortBy('lastAttemptAt')
      .reverse();
  }

  get sortedCompleteParticipations() {
    return this.model.stage.participations
      .filter((participation) => participation.status === 'complete')
      .sortBy('lastAttemptAt')
      .reverse();
  }

  get sortedDroppedOffParticipations() {
    return this.model.stage.participations
      .filter((participation) => participation.status === 'dropped_off')
      .sortBy('lastAttemptAt')
      .reverse();
  }
}
