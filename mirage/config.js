export default function () {
  this.urlPrefix = '';
  this.namespace = '/api/v1';
  this.timing = 5000;

  this.get('/courses');
  this.get('/repositories');
  this.post('/repositories');

  this.passthrough('https://d3hb14vkzrxvla.cloudfront.net/**'); // HelpScout Beacon
}
