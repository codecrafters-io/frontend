import { create, visitable } from 'ember-cli-page-object';

export default create({
  visitClaim: visitable('/perks/:slug/claim'),
});
