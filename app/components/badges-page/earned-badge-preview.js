import Component from '@glimmer/component';
import lockedBadgePreviewImage from '/assets/images/badges/locked-badge-preview.svg';

export default class EarnedBadgePreviewComponent extends Component {
  get previewImage() {
    return this.args.badge ? this.args.badge.previewImage : lockedBadgePreviewImage;
  }
}
