import BaseRoute from 'codecrafters-frontend/utils/base-route';
import { inject as service } from '@ember/service';
import type Store from '@ember-data/store';
import type CodeWalkthroughModel from 'codecrafters-frontend/models/code-walkthrough';

export type ModelType = CodeWalkthroughModel;

export default class CodeWalkthroughRoute extends BaseRoute {
  @service declare store: Store;

  allowsAnonymousAccess = true;

  async model(params: { code_walkthrough_slug: string }): Promise<ModelType> {
    let codeWalkthrough;

    if (this.store.peekAll('code-walkthrough').findBy('slug', params.code_walkthrough_slug)) {
      codeWalkthrough = this.store.peekAll('code-walkthrough').findBy('slug', params.code_walkthrough_slug);
    } else {
      const codeWalkthroughs = await this.store.findAll('code-walkthrough', { include: '' });
      codeWalkthrough = codeWalkthroughs.findBy('slug', params.code_walkthrough_slug);
    }

    return codeWalkthrough;
  }
}
