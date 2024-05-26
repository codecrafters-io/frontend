import syncRepositoryStageLists from './utils/sync-repository-stage-lists';

export default function (server) {
  server.get('/repositories', function (schema, request) {
    let repositories;

    if (request.queryParams.course_id) {
      repositories = schema.repositories.where({ userId: '63c51e91-e448-4ea9-821b-a80415f266d3', courseId: request.queryParams.course_id });
    } else {
      repositories = schema.repositories.where({ userId: '63c51e91-e448-4ea9-821b-a80415f266d3' });
    }

    syncRepositoryStageLists(window.server);

    return repositories;
  });

  server.post('/repositories', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    const language = schema.languages.find(attrs.languageId);

    attrs.cloneUrl = 'https://git.codecrafters.io/a-long-test-string.git';
    attrs.name = `${language.name}`;

    const repository = schema.repositories.create(attrs);

    repository.course.extensions.models.forEach((extension) => {
      schema.courseExtensionActivations.create({ extension, repository });
    });

    return repository;
  });

  server.patch('/repositories/:id');

  server.delete('/repositories/:id');
}
