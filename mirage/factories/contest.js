import { Factory } from 'miragejs';

export default Factory.extend({
  afterCreate(contest, server) {
    server.schema.leaderboards.create({
      contest,
    });
  },
});
