import { Factory } from 'miragejs';

export default Factory.extend({
  status: 'provisioned',
  lastAccessedAt: () => new Date(),
  humanId: () => `brainy-toad-${Math.floor(Math.random() * 999999)}`,
  expired: false,
  githubRepositoryUrl: 'https://github.com/test-user/test-repo',
});
