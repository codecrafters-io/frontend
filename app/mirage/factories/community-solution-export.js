import { Factory } from 'miragejs';

export default Factory.extend({
  status: 'provisioned',
  expiresAt: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  githubRepositoryUrl: 'https://github.com/test-user/test-repo',
});
