import Component from '@glimmer/component';
import adobeImage from '/assets/images/company-logos/adobe-company-logo.svg';
import appleImage from '/assets/images/company-logos/apple-company-logo.svg';
import awsImage from '/assets/images/company-logos/aws-company-logo.svg';
import bookingImage from '/assets/images/company-logos/bookingcom-company-logo.svg';
import cloudflareImage from '/assets/images/company-logos/cloudflare-company-logo.svg';
import coinbaseImage from '/assets/images/company-logos/coinbase-company-logo.svg';
import deliverooImage from '/assets/images/company-logos/deliveroo-company-logo.svg';
import dockerImage from '/assets/images/company-logos/docker-company-logo.svg';
import googleImage from '/assets/images/company-logos/google-company-logo.svg';
import grabImage from '/assets/images/company-logos/grab-company-logo.svg';
import jpmorganImage from '/assets/images/company-logos/jpmorgan-company-logo.svg';
import mapboxImage from '/assets/images/company-logos/mapbox-company-logo.svg';
import metaImage from '/assets/images/company-logos/meta-company-logo.svg';
import nvidiaImage from '/assets/images/company-logos/nvidia-company-logo.svg';
import porscheImage from '/assets/images/company-logos/porsche-company-logo.svg';
import robloxImage from '/assets/images/company-logos/roblox-company-logo.svg';
import salesforceImage from '/assets/images/company-logos/salesforce-company-logo.svg';
import sourcegraphImage from '/assets/images/company-logos/sourcegraph-company-logo.svg';
import stripeImage from '/assets/images/company-logos/stripe-company-logo.svg';
import substackImage from '/assets/images/company-logos/substack-company-logo.svg';
import supabaseImage from '/assets/images/company-logos/supabase-company-logo.svg';
import tencentImage from '/assets/images/company-logos/tencent-company-logo.svg';
import vercelImage from '/assets/images/company-logos/vercel-company-logo.svg';
import visaImage from '/assets/images/company-logos/visa-company-logo.svg';

interface Company {
  name: string;
  image: string;
}

interface Signature {
  Element: HTMLDivElement;
}

export default class LogoCloudComponent extends Component<Signature> {
  companiesData: Company[] = [
    { name: 'Meta', image: metaImage },
    { name: 'AWS', image: awsImage },
    { name: 'Google', image: googleImage },
    { name: 'Apple', image: appleImage },
    { name: 'Stripe', image: stripeImage },
    { name: 'Docker', image: dockerImage },
    { name: 'Cloudflare', image: cloudflareImage },
    { name: 'Adobe', image: adobeImage },
    { name: 'Salesforce', image: salesforceImage },
    { name: 'Coinbase', image: coinbaseImage },
    { name: 'Vercel', image: vercelImage },
    { name: 'NVIDIA', image: nvidiaImage },
    { name: 'Roblox', image: robloxImage },
    { name: 'Porsche', image: porscheImage },
    { name: 'Booking.com', image: bookingImage },
    { name: 'Supabase', image: supabaseImage },
    { name: 'Deliveroo', image: deliverooImage },
    { name: 'Grab', image: grabImage },
    { name: 'Substack', image: substackImage },
    { name: 'Tencent', image: tencentImage },
    { name: 'Mapbox', image: mapboxImage },
    { name: 'JPMorgan', image: jpmorganImage },
    { name: 'Visa', image: visaImage },
    { name: 'Sourcegraph', image: sourcegraphImage },
  ];
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliateLinkPage::LogoCloud': typeof LogoCloudComponent;
  }
}
