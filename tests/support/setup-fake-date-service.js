import FakeDateService from './fake-date-service';

export default function setupFakeDateService(hooks = self) {
  hooks.beforeEach(function() {
    this.owner.register('service:date', FakeDateService);
  });
}
