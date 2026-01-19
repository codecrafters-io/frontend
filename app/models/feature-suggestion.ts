import Model, { attr, belongsTo } from '@ember-data/model';
import type UserModel from './user';
import { action } from '@ember/object';

export default class FeatureSuggestionModel extends Model {
  @attr('string') declare featureSlug: string;
  @attr('date') declare createdAt: Date;
  @attr('date') declare dismissedAt: Date | null;
  @belongsTo('user', { async: false, inverse: 'featureSuggestions' }) declare user: UserModel;

  get featureIsPrivateLeaderboard() {
    return this.featureSlug === 'private-leaderboard';
  }

  get featureIsProductWalkthrough() {
    return this.featureSlug === 'product-walkthrough';
  }

  get featureIsRepositoryWorkflowTutorial() {
    return this.featureSlug === 'repository-workflow-tutorial';
  }

  get isDismissed() {
    return !!this.dismissedAt;
  }

  @action
  async dismiss() {
    this.dismissedAt = new Date();
    await this.save();
  }
}
