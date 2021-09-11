import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class FakeDataToolbarComponent extends Component {
  @service store;

  @action
  async handleFailTestsButtonClick() {
    let submission = this.store.createRecord('submission', {
      createdAt: new Date(),
      repository: this.args.repository,
      courseStage: this.args.repository.highestCompletedStage,
    });

    await submission.save();
  }

  @action
  async handlePassTestsButtonClick() {
    let submission = this.store.createRecord('submission', {
      createdAt: new Date(),
      repository: this.args.repository,
      courseStage: this.args.repository.highestCompletedStage,
    });

    await submission.save();
  }
}
