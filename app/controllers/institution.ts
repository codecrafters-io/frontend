import BYOXBanner from '/assets/images/affiliate-program-features/byox-banner.svg';
import BYOXBannerMobile from '/assets/images/affiliate-program-features/byox-banner-mobile.svg';
import Controller from '@ember/controller';
import amazonImage from '/assets/images/company-logos/amazon-company-logo.svg';
import appleImage from '/assets/images/company-logos/apple-company-logo.svg';
import coinbaseImage from '/assets/images/company-logos/coinbase-company-logo.svg';
import figmaImage from '/assets/images/company-logos/figma-company-logo.svg';
import googleImage from '/assets/images/company-logos/google-company-logo.svg';
import harvardImage from '/assets/images/company-logos/harvard-logo.svg';
import hashiCorpImage from '/assets/images/company-logos/hashicorp-company-logo.svg';
import mitImage from '/assets/images/company-logos/mit-logo.svg';
import slackImage from '/assets/images/company-logos/slack-company-logo.svg';
import stripeImage from '/assets/images/company-logos/stripe-company-logo.svg';
import testimonialsData from 'codecrafters-frontend/utils/testimonials-data';
import type { Testimonial } from 'codecrafters-frontend/utils/testimonials-data';

export default class InstitutionController extends Controller {
  BYOXBanner = BYOXBanner;
  BYOXBannerMobile = BYOXBannerMobile;

  get companies() {
    return [
      {
        name: 'Google',
        url: googleImage,
      },
      {
        name: 'Slack',
        url: slackImage,
      },
      {
        name: 'Amazon',
        url: amazonImage,
      },
      {
        name: 'Figma',
        url: figmaImage,
      },
      {
        name: 'Stripe',
        url: stripeImage,
      },
      {
        name: 'Apple',
        url: appleImage,
      },
      {
        name: 'Coinbase',
        url: coinbaseImage,
      },
      {
        name: 'HashiCorp',
        url: hashiCorpImage,
      },
      {
        name: 'Harvard',
        url: harvardImage,
      },
      {
        name: 'MIT',
        url: mitImage,
      },
    ];
  }

  get testimonialGroups(): Testimonial[][] {
    const testimonialGroup1 = [
      testimonialsData['djordje-lukic']!,
      testimonialsData['ananthalakshmi-sankar']!,
      testimonialsData['raghav-dua']!,
      testimonialsData['rahul-tarak']!,
    ];

    const testimonialGroup2 = [
      testimonialsData['charles-guo']!,
      testimonialsData['akshata-mohan']!,
      testimonialsData['pranjal-paliwal']!,
      testimonialsData['beyang-liu']!,
    ];

    const testimonialGroup3 = [
      testimonialsData['beyang-liu']!,
      testimonialsData['kang-ming-tay']!,
      testimonialsData['jonathan-lorimer']!,
      testimonialsData['patrick-burris']!,
    ];

    return [testimonialGroup1, testimonialGroup2, testimonialGroup3];
  }
}
