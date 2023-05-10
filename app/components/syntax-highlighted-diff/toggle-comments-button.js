import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ToggleCommentsButtonComponent extends Component {
  @service featureFlags;

  get variantIsDefault() {
    return this.featureFlags.solutionCommentsButtonVariant === 'control';
  }

  get variantIsExplain() {
    return this.featureFlags.solutionCommentsButtonVariant === 'explain';
  }

  get variantIsIconWithCounts() {
    return this.featureFlags.solutionCommentsButtonVariant === 'icon-with-counts';
  }
}
