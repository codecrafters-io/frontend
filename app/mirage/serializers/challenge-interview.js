import ApplicationSerializer from './application';

// The interview service always sends the repository linkage.
export default ApplicationSerializer.extend({
  alwaysIncludeLinkageData: true,
});
