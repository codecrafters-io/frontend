import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class UtmCampaignIdService extends Service {
  @service cookies;

  get firstSeenCampaignId() {
    return this.cookies.read('last_seen_utm_campaign_id');
  }

  setCampaignId(utmCampaignId) {
    if (this.firstSeenCampaignId) {
      return;
    }

    this.cookies.write('last_seen_utm_campaign_id', utmCampaignId, { maxAge: 14 * 24 * 60 * 60, path: '/' });
  }
}
