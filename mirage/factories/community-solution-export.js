import { Factory } from 'miragejs';

export default Factory.extend({
  status: 'provisioned',
  lastAccessedAt: () => new Date(),
  humanId: () => `export-${Math.random().toString(36).substring(2, 11)}`,
  expired: false,
  githubRepositoryUrl: 'https://github.com/test-user/test-repo',
});
