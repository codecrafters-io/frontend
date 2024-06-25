import { clickOnText, collection, create, fillable, triggerable, visitable } from 'ember-cli-page-object';

export default create({
  clickOnHeaderTabLink: clickOnText(),

  form: {
    inputFields: collection('[data-test-basic-details-input-field]', {
      blur: triggerable('blur'),
      fillInInput: fillable('input'),
    }),

    scope: '[data-test-basic-details-form]',
  },

  header: {
    draftLabel: {
      scope: '[data-test-draft-label]',
    },

    scope: '[data-test-concept-admin-header]',
  },

  publishConceptToggle: {
    scope: '[data-test-publish-concept-toggle]',
  },

  visit: visitable('/concepts/:concept_slug/admin/basic-details'),
});
