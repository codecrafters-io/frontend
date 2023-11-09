import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';
import type { TemporarySubmissionModel, TemporaryUserModel } from 'codecrafters-frontend/lib/temporary-types';

export default class BadgeAwardModel extends Model {
  @belongsTo('badge', { async: false, inverse: null }) declare badge: unknown;
  @belongsTo('user', { async: false, inverse: 'badgeAwards' }) declare user: TemporaryUserModel;

  @belongsTo('submission', { async: false, inverse: null }) declare submission: TemporarySubmissionModel; // This is actually polymorphic

  @attr('date') declare awardedAt: Date;
}
