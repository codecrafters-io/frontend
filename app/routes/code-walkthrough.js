import BaseRoute from 'codecrafters-frontend/utils/base-route';
import { inject as service } from '@ember/service';

export default class CodeWalkthroughRoute extends BaseRoute {
  @service store;
  allowsAnonymousAccess = true;

  async model(params) {
    let codeWalkthrough;

    if (this.store.peekAll('code-walkthrough').findBy('slug', params.code_walkthrough_slug)) {
      codeWalkthrough = this.store.peekAll('code-walkthrough').findBy('slug', params.code_walkthrough_slug);
    } else {
      let codeWalkthroughs = await this.store.findAll('code-walkthrough', { include: '' });
      codeWalkthrough = codeWalkthroughs.findBy('slug', params.code_walkthrough_slug);
    }

    return codeWalkthrough;
  }
}
