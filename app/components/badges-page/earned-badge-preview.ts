import Component from '@glimmer/component';
import lockedBadgePreviewImage from '/assets/images/badges/locked-badge-preview.svg';
import type BadgeModel from 'codecrafters-frontend/models/badge';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    badge?: BadgeModel;
  };
}

export default class EarnedBadgePreviewComponent extends Component<Signature> {
  get previewImage() {
    return this.args.badge ? this.args.badge.previewImage : lockedBadgePreviewImage;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'BadgesPage::EarnedBadgePreview': typeof EarnedBadgePreviewComponent;
  }
}
