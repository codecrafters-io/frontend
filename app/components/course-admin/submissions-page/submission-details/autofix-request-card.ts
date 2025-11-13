import Component from '@glimmer/component';
import { service } from '@ember/service';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';
import type AutofixRequestModel from 'codecrafters-frontend/models/autofix-request';
import { codeCraftersDark } from 'codecrafters-frontend/utils/code-mirror-themes';
import config from 'codecrafters-frontend/config/environment';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    autofixRequest: AutofixRequestModel;
  };
}

export default class AutofixRequestCard extends Component<Signature> {
  @service declare darkMode: DarkModeService;

  get autofixRequestAdminUrl() {
    return `${config.x.backendUrl}/admin/autofix_requests/${this.args.autofixRequest.id}`;
  }

  get codeMirrorTheme() {
    return codeCraftersDark;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::SubmissionsPage::SubmissionDetails::AutofixRequestCard': typeof AutofixRequestCard;
  }
}
