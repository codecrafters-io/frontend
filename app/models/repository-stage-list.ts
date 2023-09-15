import Model, { belongsTo, hasMany } from '@ember-data/model';
import { TemporaryRepositoryModel } from './temporary-types';
import RepositoryStageListItemModel from 'codecrafters-frontend/models/repository-stage-list-item';

export default class RepositoryStageListModel extends Model {
  @belongsTo('repository', { async: false }) declare repository: TemporaryRepositoryModel;
  @hasMany('repository-stage-list-item', { async: false }) declare items: RepositoryStageListItemModel[];
}
