import { Factory } from 'miragejs';

export default Factory.extend({
  body: 'Hello',
  createdAt: () => new Date(),
  inputMode: 'text',
  rating: null,
  refused: false,
  role: 'user',
  status: 'complete',
});
