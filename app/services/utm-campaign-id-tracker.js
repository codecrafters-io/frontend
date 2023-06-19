import Service from '@ember/service';
import config from 'codecrafters-frontend/config/environment';
import { inject as service } from '@ember/service';

export default class UtmCampaignIdService extends Service {
  @service cookies;

  get firstSeenCampaignId() {
    return this.cookies.read('first_seen_utm_campaign_id_v1');
  }

  setCampaignId(utmCampaignId) {
    if (this.firstSeenCampaignId) {
      return;
    }

    // 24 hours
    this.cookies.write('first_seen_utm_campaign_id_v1', utmCampaignId, {
      maxAge: 24 * 60 * 60,
      path: '/',
      domain: config.environment === 'test' ? 'localhost' : 'codecrafters.io',
    });
  }
}
