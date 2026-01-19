import Model, { attr, belongsTo } from '@ember-data/model';
import UserModel from 'codecrafters-frontend/models/user';

export default class OnboardingSurveyModel extends Model {
  @belongsTo('user', { async: false, inverse: null }) user!: UserModel;

  @attr('string') declare freeFormAnswerForUsagePurpose: string;
  @attr('string') declare freeFormAnswerForReferralSource: string;

  // @ts-expect-error No serializer defined for ''
  @attr('') declare selectedOptionsForUsagePurpose: string[];

  // @ts-expect-error No serializer defined for ''
  @attr('') declare selectedOptionsForReferralSource: string[];

  @attr('string') declare status: 'incomplete' | 'complete';
}
