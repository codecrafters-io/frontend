import Model, { attr, belongsTo } from '@ember-data/model';
import type InstitutionModel from 'codecrafters-frontend/models/institution';
import type UserModel from 'codecrafters-frontend/models/user';

export default class InstitutionMembershipGrantModel extends Model {
  @belongsTo('institution', { async: true, inverse: null }) declare institution: InstitutionModel;
  @belongsTo('user', { async: true, inverse: null }) declare user: UserModel;

  @attr('date') declare grantedAt: Date;
  @attr('number') declare validityInDays: number;
}
