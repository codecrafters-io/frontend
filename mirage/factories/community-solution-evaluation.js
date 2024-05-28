import { Factory } from 'miragejs';
import config from 'codecrafters-frontend/config/environment';

export default Factory.extend({
  createdAt: () => new Date(),
  status: 'pass',

  logsFileUrl: `${config.x.backendUrl}/api/v1/fake-community-solution-evaluation-logs`,
  promptFileUrl: `${config.x.backendUrl}/api/v1/fake-community-solution-evaluation-prompt-file`,
});
