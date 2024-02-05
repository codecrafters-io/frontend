import { Factory } from 'miragejs';

export default Factory.extend({
  selectedOptionsForUsagePurpose: () => [],
  selectedOptionsForReferralSource: () => [],
  freeFormAnswerForUsagePurpose: '',
  freeFormAnswerForReferralSource: '',
});
