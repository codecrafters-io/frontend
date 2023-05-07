/* global self */
self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    { handler: 'silence', matchId: 'ember-global' },
    { handler: 'silence', matchId: 'deprecated-run-loop-and-computed-dot-access' },
    { handler: 'silence', matchId: 'implicit-injections' },
    { handler: 'silence', matchId: 'manager-capabilities.modifiers-3-13' },
    { handler: 'silence', matchId: 'ember-data:deprecate-non-strict-relationships' },
    { handler: 'silence', matchId: 'ember-data:deprecate-early-static' }, // ember-cli-mirage
    { handler: 'silence', matchId: 'ember-data:deprecate-array-like' }, // needs to be fixed
    { handler: 'silence', matchId: 'ember-polyfills.deprecate-assign' }, // ember-api-actions
  ],
};
