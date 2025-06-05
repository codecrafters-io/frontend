import Component from '@glimmer/component';
import mikeKriegerImageUrl from 'codecrafters-frontend/assets/images/backer-headshots/mike-krieger.png';
import supabaseCompanyLogoUrl from 'codecrafters-frontend/assets/images/company-logos/supabase-company-logo.svg';

interface Signature {
  Element: HTMLDivElement;
}

export default class BackerCardListComponent extends Component<Signature> {
  get backers() {
    return [
      {
        name: 'Mike Krieger',
        title: 'Co-founder/CTO, Instagram',
        imageUrl: mikeKriegerImageUrl,
        companyLogoUrl: supabaseCompanyLogoUrl, // TODO: Use Instagram logo
        companyName: 'Instagram',
      },
      {
        name: 'Arash Ferdowsi',
        title: 'Co-founder/CTO, Dropbox',
        imageUrl: mikeKriegerImageUrl,
        companyLogoUrl: supabaseCompanyLogoUrl, // TODO: Use Dropbox logo
        companyName: 'Dropbox',
      },
      {
        name: 'Jitendra Vaidya',
        title: 'Co-founder, PlanetScale',
        imageUrl: mikeKriegerImageUrl,
        companyLogoUrl: supabaseCompanyLogoUrl, // TODO: Use PlanetScale logo
        companyName: 'PlanetScale',
      },
      {
        name: 'JJ Kasper',
        title: 'Maintainer of Next.js',
        imageUrl: mikeKriegerImageUrl,
        companyLogoUrl: supabaseCompanyLogoUrl, // TODO: Use Next.js logo
        companyName: 'Next.js',
      },
      {
        name: 'Paul Copplestone',
        title: 'Co-Founder, Supabase',
        imageUrl: mikeKriegerImageUrl,
        companyLogoUrl: supabaseCompanyLogoUrl,
        companyName: 'Supabase',
      },
    ];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::BackerCardList': typeof BackerCardListComponent;
  }
}
