import Model, { attr, belongsTo } from '@ember-data/model';
import type InstitutionModel from 'codecrafters-frontend/models/institution';
import type UserModel from 'codecrafters-frontend/models/user';

export default class InstitutionMembershipGrantApplicationModel extends Model {
  @belongsTo('institution', { async: true, inverse: null }) declare institution: InstitutionModel;
  @belongsTo('user', { async: true, inverse: null }) declare user: UserModel;

  @attr('date') declare createdAt: Date;
  @attr('string') declare normalizedEmailAddress: string;
  @attr('string') declare originalEmailAddress: string;
  @attr('string') declare rejectionReason: string | null;
  @attr('string') declare status: 'awaiting_verification' | 'approved' | 'rejected';
}
