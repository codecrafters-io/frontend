import Component from '@glimmer/component';
import awsImage from '/assets/images/company-logos/aws.png';
import coinbaseImage from '/assets/images/company-logos/coinbase.png';
import vercelImage from '/assets/images/company-logos/vercel.png';
import cloudflareImage from '/assets/images/company-logos/cloudflare.png';
import nvidiaImage from '/assets/images/company-logos/nvidia.png';
import robloxImage from '/assets/images/company-logos/roblox.png';
import stripeImage from '/assets/images/company-logos/stripe.png';
import appleImage from '/assets/images/company-logos/apple.png';
import porscheImage from '/assets/images/company-logos/porsche-1.png';
import bookingImage from '/assets/images/company-logos/bookingcom.png';
import supabaseImage from '/assets/images/company-logos/supabase.png';
import deliverooImage from '/assets/images/company-logos/deliveroo.png';
import dockerImage from '/assets/images/company-logos/docker-company-logo.svg';
import metaImage from '/assets/images/company-logos/meta.png';
import grabImage from '/assets/images/company-logos/grab.png';
import salesforceImage from '/assets/images/company-logos/salesforce.png';
import substackImage from '/assets/images/company-logos/substack.png';
import tencentImage from '/assets/images/company-logos/tencent-white.svg';
import adobeImage from '/assets/images/company-logos/adobe.png';
import googleImage from '/assets/images/company-logos/google.png';
import mapboxImage from '/assets/images/company-logos/mapbox.png';
import jpmorganImage from '/assets/images/company-logos/jpmorgan.png';
import visaImage from '/assets/images/company-logos/visa.png';
import sourcegraphImage from '/assets/images/company-logos/sourcegraph.png';

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
