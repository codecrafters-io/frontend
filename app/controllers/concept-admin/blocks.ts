import ConceptModel from 'codecrafters-frontend/models/concept';
import Controller from '@ember/controller';

export default class BlocksController extends Controller {
  declare model: {
    concept: ConceptModel;
  };
}
