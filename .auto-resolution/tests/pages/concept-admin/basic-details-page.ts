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
    scope: '[data-test-delete-concept-button]',
  },

  deleteConceptModal: {
    deleteConceptButton: {
      mouseleave: triggerable('mouseleave'),
      mousedown: triggerable('mousedown'),
      touchstart: triggerable('touchstart'),

      progressIndicator: {
        scope: '[data-test-progress-indicator]',
        get width() {
          const element = document.querySelector(this.scope) as HTMLElement;
          if (!element) return 0;

          const styleAttr = element.getAttribute('style');
          const widthMatch = styleAttr?.match(/width:\s*(\d+)%/);

          return widthMatch ? parseInt(widthMatch[1] as string) : 0;
        },
      },

      release: triggerable('mouseup'),
      scope: '[data-test-confirm-delete-concept-button]',
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
