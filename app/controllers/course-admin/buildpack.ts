import Controller from '@ember/controller';
import BuildpackModel from 'codecrafters-frontend/models/buildpack';

export default class BuildpackController extends Controller {
  declare model: {
    buildpack: BuildpackModel;
  };
}
