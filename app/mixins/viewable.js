/* eslint-disable ember/no-new-mixins */
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  async createView(metadata = {}) {
    const view = this.store.createRecord('view', {
      resourceId: this.id,
      resourceType: this.constructor.modelName,
      user: this.authenticator.currentUser,
      metadata: metadata,
    });

    await view.save();
  },
});
