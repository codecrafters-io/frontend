import { Factory } from 'miragejs';

export default Factory.extend({
  affiliateName: () => 'test',
  affiliateAvatarUrl: () => 'https://avatars.githubusercontent.com/u/1234567890?v=4',
  url: () => `https://app.codecrafters.io/join?via=test`,
});
