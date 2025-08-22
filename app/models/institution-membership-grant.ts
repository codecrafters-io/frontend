import Model, { attr, belongsTo } from '@ember-data/model';
import type InstitutionModel from 'codecrafters-frontend/models/institution';
import type UserModel from 'codecrafters-frontend/models/user';

export default class InstitutionMembershipGrantModel extends Model {
  @belongsTo('institution', { async: false, inverse: null }) declare institution: InstitutionModel;
  @belongsTo('user', { async: true, inverse: 'institutionMembershipGrants' }) declare user: UserModel;

  @attr('date') declare grantedAt: Date;
  @attr('number') declare validityInDays: number;

  get expiresAt() {
    return new Date(this.grantedAt.getTime() + this.validityInDays * 24 * 60 * 60 * 1000);
  }
}
