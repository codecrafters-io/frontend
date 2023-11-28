import { attr, belongsTo } from '@ember-data/model';
import BadgeModel from 'codecrafters-frontend/models/badge';
import Model from '@ember-data/model';
import SubmissionModel from 'codecrafters-frontend/models/submission';
import UserModel from 'codecrafters-frontend/models/user';

export default class BadgeAwardModel extends Model {
  @belongsTo('badge', { async: false, inverse: null }) badge!: BadgeModel;
  @belongsTo('user', { async: false, inverse: 'badgeAwards' }) declare user: UserModel;

  @belongsTo('submission', { async: false, inverse: null }) declare submission: SubmissionModel; // This is actually polymorphic

  @attr('date') declare awardedAt: Date;
}
