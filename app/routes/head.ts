import Route from '@ember/routing/route';
import type HeadDataService from 'codecrafters-frontend/services/meta-data';

interface HeadTemplateModel {
  metaData: HeadDataService;
  defaults: {
    description: string;
    type: string;
    siteName: string;
    title: string;
    imageUrl: string;
    twitterCard: string;
    twitterSite: string;
  };
}

export default class HeadRoute extends Route<HeadTemplateModel> {}
