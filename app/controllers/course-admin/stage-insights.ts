import Controller from '@ember/controller';
import type { ModelType } from 'codecrafters-frontend/routes/course-admin/stage-insights';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

export default class StageInsightsController extends Controller {
  declare model: ModelType;

  get participationAnalysis() {
    return this.model.stage.participationAnalysis!;
  }

  get sortedActiveParticipations() {
    return this.model.stage.participations
      .filter((participation) => participation.status === 'active')
      .sort(fieldComparator('firstAttemptAt'))
      .reverse();
  }

  get sortedCompleteParticipations() {
    return this.model.stage.participations
      .filter((participation) => participation.status === 'complete')
      .sort(fieldComparator('firstAttemptAt'))
      .reverse();
  }

  get sortedDroppedOffAfterAttemptParticipations() {
    return this.model.stage.participations
      .filter((participation) => participation.status === 'dropped_off_after_attempt')
      .sort(fieldComparator('firstAttemptAt'))
      .reverse();
  }
}
