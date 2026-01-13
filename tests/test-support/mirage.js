import { setupMirage as _setupMirage } from 'ember-mirage/test-support';
import mirageConfig from 'codecrafters-frontend/mirage/config';

export function setupMirage(hooks, options) {
  options = options || {};
  options.createServer = options.createServer || mirageConfig;

  return _setupMirage(hooks, options);
}
