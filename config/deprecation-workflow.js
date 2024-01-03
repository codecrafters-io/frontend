/* global self */
self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    { handler: 'throw', matchId: 'ember-data:deprecate-non-strict-relationships' },
    { handler: 'silence', matchId: 'ember-data:deprecate-array-like' }, // needs to be fixed
    { handler: 'silence', matchId: 'ember-polyfills.deprecate-assign' }, // ember-api-actions
  ],
};
