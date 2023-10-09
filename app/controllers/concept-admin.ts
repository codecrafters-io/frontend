import Controller from '@ember/controller';
import ConceptModel from 'codecrafters-frontend/models/concept';

export default class ConceptAdminController extends Controller {
  declare model: {
    concept: ConceptModel;
  };
}
