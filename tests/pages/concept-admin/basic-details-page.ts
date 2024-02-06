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

  visit: visitable('/concepts/:concept_slug/admin/basic-details'),
});
