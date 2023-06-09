import Component from '@glimmer/component';

// @ts-ignore
import lockedBadgePreviewImage from '/assets/images/badges/locked-badge-preview.svg';
// @ts-ignore
import curieBadgeImage from '/assets/images/badges/curie-badge.svg';
// @ts-ignore
import hamiltonBadgeImage from '/assets/images/badges/hamilton-badge.svg';
// @ts-ignore
import teslaBadgeImage from '/assets/images/badges/tesla-badge.svg';
// @ts-ignore
import turingBadgeImage from '/assets/images/badges/turing-badge.svg';

export default class EarnedBadgePreviewComponent extends Component {
  get badgePreviewImage() {
    switch (this.args.badge.slug) {
      case 'quick-to-start':
        return curieBadgeImage;
      case 'right-the-first-time':
        return hamiltonBadgeImage;
      case 'three-in-a-day':
        return teslaBadgeImage;
      case 'five-in-a-week':
        return turingBadgeImage;
      default:
        return lockedBadgePreviewImage;
    }
  }
}
