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

export default class LogoCloudComponent extends Component {
  companiesData = [
    {
      name: 'meta',
      image: metaImage,
    },
    {
      name: 'aws',
      image: awsImage,
    },
    {
      name: 'google',
      image: googleImage,
    },
    {
      name: 'apple',
      image: appleImage,
    },
    {
      name: 'stripe',
      image: stripeImage,
    },
    {
      name: 'docker',
      image: dockerImage,
    },
    {
      name: 'cloudflare',
      image: cloudflareImage,
    },
    {
      name: 'adobe',
      image: adobeImage,
    },
    {
      name: 'salesforce',
      image: salesforceImage,
    },
    {
      name: 'coinbase',
      image: coinbaseImage,
    },
    {
      name: 'vercel',
      image: vercelImage,
    },
    {
      name: 'NVIDIA',
      image: nvidiaImage,
    },
    {
      name: 'roblox',
      image: robloxImage,
    },
    {
      name: 'porsche',
      image: porscheImage,
    },
    {
      name: 'booking.com',
      image: bookingImage,
    },
    {
      name: 'supabase',
      image: supabaseImage,
    },
    {
      name: 'deliveroo',
      image: deliverooImage,
    },
    {
      name: 'grab',
      image: grabImage,
    },
    {
      name: 'substack',
      image: substackImage,
    },
    {
      name: 'tencent',
      image: tencentImage,
    },
    {
      name: 'mapbox',
      image: mapboxImage,
    },
    {
      name: 'jpmorgan',
      image: jpmorganImage,
    },
    {
      name: 'visa',
      image: visaImage,
    },
    {
      name: 'sourcegraph',
      image: sourcegraphImage,
    },
  ];
}
