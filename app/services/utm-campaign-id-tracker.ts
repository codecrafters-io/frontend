import Service, { inject as service } from '@ember/service';
import config from 'codecrafters-frontend/config/environment';
import type CookiesService from 'ember-cookies/services/cookies';

export default class UtmCampaignIdService extends Service {
  @service declare cookies: CookiesService;

  get firstSeenCampaignId(): string | null | undefined {
    return this.cookies.read('first_seen_utm_campaign_id_v1');
  }

  setCampaignId(utmCampaignId: string): void {
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
