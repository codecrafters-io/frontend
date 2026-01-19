import Controller from '@ember/controller';
import FreeUsageGrantModel from 'codecrafters-frontend/models/free-usage-grant';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';

export default class ReferralLinkController extends Controller {
  declare model: { acceptedReferralOfferFreeUsageGrant: FreeUsageGrantModel; referralLink: ReferralLinkModel };
}
