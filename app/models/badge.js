import Model from '@ember-data/model';
import { attr, hasMany } from '@ember-data/model';

import lockedBadgePreviewImage from '/assets/images/badges/locked-badge-preview.svg';
import curieBadgeImage from '/assets/images/badges/curie-badge.svg';
import hamiltonBadgeImage from '/assets/images/badges/hamilton-badge.svg';
import hopperBadgeImage from '/assets/images/badges/hopper-badge.svg';
import teslaBadgeImage from '/assets/images/badges/tesla-badge.svg';
import turingBadgeImage from '/assets/images/badges/turing-badge.svg';

export default class Badge extends Model {
  @attr('string') descriptionMarkdown;
  @attr('string') instructionsMarkdown;
  @attr('string') name;
  @attr('number') priority;
  @attr('string') shortDescription;
  @attr('string') slug;

  @hasMany('badge-award', { async: false, inverse: null }) currentUserAwards;

  get previewImage() {
    switch (this.slug) {
      case 'right-the-first-time':
        return teslaBadgeImage;
      case 'persistent':
        return curieBadgeImage;
      case 'quick-to-start':
        return hopperBadgeImage;
      case 'three-in-a-day':
        return turingBadgeImage;
      case 'five-in-a-week':
        return hamiltonBadgeImage;
      default:
        return lockedBadgePreviewImage;
    }
  }
}
