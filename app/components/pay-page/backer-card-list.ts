import Component from '@glimmer/component';
import mikeKriegerImageUrl from 'codecrafters-frontend/assets/images/backer-headshots/mike-krieger.png';
import arashFerdowsiImageUrl from 'codecrafters-frontend/assets/images/backer-headshots/arash-ferdowsi.png';
import jitendraVaidyaImageUrl from 'codecrafters-frontend/assets/images/backer-headshots/jitendra-vaidya.png';
import jjKasperImageUrl from 'codecrafters-frontend/assets/images/backer-headshots/jj-kasper.png';
import paulCopplestoneImageUrl from 'codecrafters-frontend/assets/images/backer-headshots/paul-copplestone.png';
import instagramCompanyLogoUrl from 'codecrafters-frontend/assets/images/company-logos/instagram-company-logo.svg';
import dropboxCompanyLogoUrl from 'codecrafters-frontend/assets/images/company-logos/dropbox-company-logo.svg';
import planetscaleCompanyLogoUrl from 'codecrafters-frontend/assets/images/company-logos/planetscale-company-logo.svg';
import nextjsCompanyLogoUrl from 'codecrafters-frontend/assets/images/company-logos/nextjs-company-logo.svg';
import supabaseCompanyLogoUrl from 'codecrafters-frontend/assets/images/company-logos/supabase-company-logo.svg';

interface Signature {
  Element: HTMLDivElement;
}

export default class BackerCardListComponent extends Component<Signature> {
  get backers() {
    return [
      {
        name: 'Arash Ferdowsi',
        title: 'Co-founder/CTO, Dropbox',
        imageUrl: mikeKriegerImageUrl,
        companyLogoUrl: dropboxCompanyLogoUrl,
        companyName: 'Dropbox',
      },
      {
        name: 'Jitendra Vaidya',
        title: 'Co-founder, PlanetScale',
        imageUrl: jitendraVaidyaImageUrl,
        companyLogoUrl: planetscaleCompanyLogoUrl,
        companyName: 'PlanetScale',
      },
      {
        name: 'JJ Kasper',
        title: 'Maintainer of Next.js',
        imageUrl: jjKasperImageUrl,
        companyLogoUrl: nextjsCompanyLogoUrl,
        companyName: 'Next.js',
      },
      {
        name: 'Paul Copplestone',
        title: 'Co-Founder, Supabase',
        imageUrl: paulCopplestoneImageUrl,
        companyLogoUrl: supabaseCompanyLogoUrl,
        companyName: 'Supabase',
      },
      {
        name: 'Mike Krieger',
        title: 'Co-founder/CTO, Instagram',
        imageUrl: arashFerdowsiImageUrl,
        companyLogoUrl: instagramCompanyLogoUrl,
        companyName: 'Instagram',
      },
    ];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::BackerCardList': typeof BackerCardListComponent;
  }
}
