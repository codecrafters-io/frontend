import Component from '@glimmer/component';
import lockedBadgePreviewImage from '/assets/images/badges/locked-badge-preview.svg';

export interface Signature {
  Element: HTMLDivElement;
}

export default class LockedBadgePreviewComponent extends Component<Signature> {
  lockedBadgePreviewImage = lockedBadgePreviewImage;
}
