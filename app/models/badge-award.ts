import BadgeModel from 'codecrafters-frontend/models/badge';
import Model from '@ember-data/model';
import UserModel from 'codecrafters-frontend/models/user';
import type CourseStageCompletionModel from 'codecrafters-frontend/models/course-stage-completion';
import { attr, belongsTo } from '@ember-data/model';

export default class BadgeAwardModel extends Model {
  @belongsTo('badge', { async: false, inverse: null }) declare badge: BadgeModel;
  @belongsTo('user', { async: false, inverse: 'badgeAwards' }) declare user: UserModel;
  @belongsTo('course-stage-completion', { async: false, inverse: 'badgeAwards' }) declare courseStageCompletion: CourseStageCompletionModel; // This is actually polymorphic

  @attr('date') declare awardedAt: Date;
}
