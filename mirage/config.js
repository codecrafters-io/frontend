export default function () {
  this.urlPrefix = '';
  this.namespace = '/api/v1';
  this.timing = 500;

  this.get('/courses');
  this.get('/repositories');
}
