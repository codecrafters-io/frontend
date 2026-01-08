import Model, { attr, belongsTo } from '@ember-data/model';
import type UserModel from 'codecrafters-frontend/models/user';

export default class EmailAddressModel extends Model {
  @attr('string') declare value: string;
  @belongsTo('user', { async: false, inverse: 'emailAddresses' }) declare user: UserModel;
}
