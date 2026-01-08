import Model, { belongsTo, hasMany } from '@ember-data/model';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import RepositoryStageListItemModel from 'codecrafters-frontend/models/repository-stage-list-item';

export default class RepositoryStageListModel extends Model {
  @belongsTo('repository', { async: false, inverse: 'stageList' }) declare repository: RepositoryModel;
  @hasMany('repository-stage-list-item', { async: false, inverse: 'list' }) declare items: RepositoryStageListItemModel[];
}
