import { clickOnText, collection, create, fillable, text, triggerable, visitable } from 'ember-cli-page-object';

export default create({
  clickOnHeaderTabLink: clickOnText(),

  form: {
    inputFields: collection('[data-test-basic-details-input-field]', {
      blur: triggerable('blur'),
      fillInInput: fillable('input'),
    }),

    scope: '[data-test-basic-details-form]',
  },

  deleteMyConceptButton: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-delete-my-concept-button]',
  },

  deleteConceptModal: {
    deleteConceptButton: {
      hover: triggerable('mouseenter'),
      leave: triggerable('mouseleave'),
      press: triggerable('mousedown'),

      progressIndicator: {
        scope: '[data-test-progress-indicator]',
      },

      release: triggerable('mouseup'),
      scope: '[data-test-delete-concept-button]',
    },

    scope: '[data-test-delete-concept-modal]',
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

  publishConceptToggleDescriptionText: text('[data-test-publish-concept-toggle-description]'),
  visit: visitable('/concepts/:concept_slug/admin/basic-details'),
});
