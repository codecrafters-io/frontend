import { create, triggerable, visitable } from 'ember-cli-page-object';

export default create({
  profileDescription: {
    input: {
      blur: triggerable('blur'),
      scope: '[data-test-profile-description-input]',
    },
  },

  visit: visitable('/settings/profile'),
});
