export default function () {
  this.urlPrefix = '';
  this.namespace = '/api/v1';
  this.timing = 1000;

  window.server = this; // Hack! Is there a better way?

  this.get('/courses');
  this.get('/repositories');

  this.post('/repositories', function (schema, request) {
    let attrs = this.normalizedRequestAttrs();

    attrs.cloneUrl = 'https://test';
    attrs.name = 'Language #n';

    return schema.repositories.create(attrs);
  });

  this.passthrough('https://d3hb14vkzrxvla.cloudfront.net/**'); // HelpScout Beacon
}
