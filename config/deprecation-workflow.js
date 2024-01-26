/* global self */
self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    { handler: 'silence', matchId: 'ember-data:deprecate-array-like' }, // needs to be fixed
    { handler: 'throw', matchId: 'ember-data:deprecate-legacy-imports' }, // will be removed in ember 6
    { handler: 'throw', matchId: 'ember-data:deprecate-non-strict-types' }, // will be removed in ember 6
    { handler: 'throw', matchId: 'ember-data:deprecate-non-unique-relationship-entries' }, // will be removed in ember 6
  ],
};
