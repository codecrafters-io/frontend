export default function () {
  this.urlPrefix = '';
  this.namespace = '/api/v1';
  this.timing = 1000;

  this.get('/courses');
  this.get('/repositories');

  this.post('/repositories', function (schema, request) {
    let attrs = this.normalizedRequestAttrs();

    attrs.cloneUrl = 'https://test';
    attrs.name = 'Language #n';

    return schema.repositories.create(attrs);
  });

  this.post('/submissions', function (schema, request) {
    let attrs = this.normalizedRequestAttrs();
    let submission = schema.submissions.create(attrs);

    submission.repository.update('lastSubmission', submission);

    return submission;
  });

  this.passthrough('https://d3hb14vkzrxvla.cloudfront.net/**'); // HelpScout Beacon
}
