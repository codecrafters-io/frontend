import Component from '@glimmer/component';
import lockedBadgePreviewImage from '/assets/images/badges/locked-badge-preview.svg';

export interface Signature {
  Element: HTMLDivElement;
}

export default class LockedBadgePreview extends Component<Signature> {
  lockedBadgePreviewImage = lockedBadgePreviewImage;
}
