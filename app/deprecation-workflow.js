import setupDeprecationWorkflow from 'ember-cli-deprecation-workflow';

setupDeprecationWorkflow({
  throwOnUnhandled: true,
  workflow: [{ handler: 'log', matchId: 'importing-inject-from-ember-service' }],
});
