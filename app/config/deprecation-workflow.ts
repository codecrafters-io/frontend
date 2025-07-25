import setupDeprecationWorkflow from 'ember-cli-deprecation-workflow';

setupDeprecationWorkflow({
  throwOnUnhandled: true,
  workflow: [
    { handler: 'log', matchId: 'ember-data:deprecate-legacy-imports' }, // importing authenticator service in current-user initializer causes this
  ],
});
