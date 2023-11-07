import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import BuildpackModel from 'codecrafters-frontend/models/buildpack';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    buildpack: BuildpackModel;
  };
};

export default class BuildpackComponent extends Component<Signature> {
  @service declare router: RouterService;

  get wasUpdatedInLastHour() {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    return this.args.buildpack.updatedAt > oneHourAgo;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::BuildpacksPage::BuildpackItem': typeof BuildpackComponent;
  }
}
