import Service, { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import FastBootService from 'ember-cli-fastboot/services/fastboot';
import config from 'codecrafters-frontend/config/environment';
import type { Metric } from 'web-vitals';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

export default class WebVitalsService extends Service {
  @service declare router: RouterService;
  @service declare fastboot: FastBootService;

  static getConnectionSpeed(): string {
    if ('connection' in navigator && navigator.connection && typeof navigator.connection === 'object') {
      if ('effectiveType' in navigator.connection && typeof navigator.connection.effectiveType === 'string') {
        return navigator.connection.effectiveType;
      }
    }

    return '';
  }

  reportMetric(metric: Metric): void {
    const vercelAnalyticsId = config.x.vercelAnalyticsId;

    if (!vercelAnalyticsId) {
      return;
    }

    const vitalsUrl = 'https://vitals.vercel-insights.com/v1/vitals';
    const body = {
      dsn: vercelAnalyticsId,
      event_name: metric.name,
      href: location.href,
      id: metric.id,
      page: this.router.recognize(location.pathname).name,
      speed: WebVitalsService.getConnectionSpeed(),
      value: metric.value.toString(),
    };

    const blob = new Blob([new URLSearchParams(body).toString()], {
      type: 'application/x-www-form-urlencoded',
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(vitalsUrl, blob);
    } else {
      fetch(vitalsUrl, {
        body: blob,
        method: 'POST',
        credentials: 'omit',
        keepalive: true,
      });
    }
  }

  setupCallbacks() {
    if (this.fastboot.isFastBoot) {
      return;
    }

    onCLS((metric) => this.reportMetric(metric));
    onFCP((metric) => this.reportMetric(metric));
    onLCP((metric) => this.reportMetric(metric));
    onTTFB((metric) => this.reportMetric(metric));
    onINP((metric) => this.reportMetric(metric));
  }
}
