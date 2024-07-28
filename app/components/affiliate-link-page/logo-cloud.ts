import Component from '@glimmer/component';
import adobeImage from '/assets/images/company-logos/adobe-company-logo.svg';
import appleImage from '/assets/images/company-logos/apple-company-logo.svg';
import awsImage from '/assets/images/company-logos/aws-company-logo.svg';
import bookingImage from '/assets/images/company-logos/bookingcom-company-logo.svg';
import cloudflareImage from '/assets/images/company-logos/cloudflare-company-logo.svg';
import coinbaseImage from '/assets/images/company-logos/coinbase-company-logo.svg';
import deliverooImage from '/assets/images/company-logos/deliveroo-company-logo.png';
import dockerImage from '/assets/images/company-logos/docker-company-logo.svg';
import googleImage from '/assets/images/company-logos/google-company-logo.svg';
import grabImage from '/assets/images/company-logos/grab-company-logo.svg';
import jpmorganImage from '/assets/images/company-logos/jpmorgan-company-logo.svg';
import mapboxImage from '/assets/images/company-logos/mapbox-company-logo.svg';
import metaImage from '/assets/images/company-logos/meta-company-logo.svg';
import nvidiaImage from '/assets/images/company-logos/nvidia-company-logo.svg';
import porscheImage from '/assets/images/company-logos/porsche-company-logo.png';
import robloxImage from '/assets/images/company-logos/roblox-company-logo.svg';
import salesforceImage from '/assets/images/company-logos/salesforce-company-logo.png';
import sourcegraphImage from '/assets/images/company-logos/sourcegraph-company-logo.svg';
import stripeImage from '/assets/images/company-logos/stripe-company-logo.svg';
import substackImage from '/assets/images/company-logos/substack-company-logo.png';
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
    { name: 'NVIDIA', image: nvidiaImage },
    { name: 'Adobe', image: adobeImage },
    { name: 'Apple', image: appleImage },
    { name: 'AWS', image: awsImage },
    { name: 'Booking.com', image: bookingImage },
    { name: 'Cloudflare', image: cloudflareImage },
    { name: 'Coinbase', image: coinbaseImage },
    { name: 'Deliveroo', image: deliverooImage },
    { name: 'Docker', image: dockerImage },
    { name: 'Grab', image: grabImage },
    { name: 'Google', image: googleImage },
    { name: 'JPMorgan', image: jpmorganImage },
    { name: 'Mapbox', image: mapboxImage },
    { name: 'Meta', image: metaImage },
    { name: 'Porsche', image: porscheImage },
    { name: 'Roblox', image: robloxImage },
    { name: 'Salesforce', image: salesforceImage },
    { name: 'Sourcegraph', image: sourcegraphImage },
    { name: 'Stripe', image: stripeImage },
    { name: 'Substack', image: substackImage },
    { name: 'Supabase', image: supabaseImage },
    { name: 'Tencent', image: tencentImage },
    { name: 'Vercel', image: vercelImage },
    { name: 'Visa', image: visaImage },
  ];
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Affiliate::LinkPage::LogoCloud': typeof LogoCloudComponent;
  }
}
