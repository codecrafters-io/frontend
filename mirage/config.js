export default function () {
  this.urlPrefix = '';
  this.namespace = '/api/v1';
  this.timing = 1000;

  this.get('/courses');
  this.get('/repositories');

  this.post('/repositories', (schema, request) => {
    const attrs = JSON.parse(request.requestBody).movie;
    const repository = schema.repositories.create(attrs);

    console.log('scheduling first push to repository to run in 2 seconds');

    setTimeout(() => {
      console.log('emulating first push to repository');
      repository.update('lastSubmissionAt', new Date());
    }, 2000);

    return repository;
  });

  this.passthrough('https://d3hb14vkzrxvla.cloudfront.net/**'); // HelpScout Beacon
}
