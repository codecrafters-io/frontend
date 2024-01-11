import Model, { attr, belongsTo } from '@ember-data/model';
import CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';

export default class SolutionComparisonModel extends Model {
  @belongsTo('community-course-stage-solution', { async: false, inverse: null }) declare firstSolution: CommunityCourseStageSolutionModel;
  @belongsTo('community-course-stage-solution', { async: false, inverse: null }) declare secondSolution: CommunityCourseStageSolutionModel;

  @attr('string') declare result: 'first_wins' | 'second_wins' | 'tie';
  @attr('date') declare createdAt: Date;
  @attr('string') declare explanation: string;
}
