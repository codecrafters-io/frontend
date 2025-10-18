export default function (server) {
  server.post('/course-extension-activations', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    const existingActivations = schema.courseExtensionActivations.where({ repositoryId: attrs.repositoryId });
    attrs.position = existingActivations.length + 1;

    return schema.courseExtensionActivations.create(attrs);
  });

  server.delete('/course-extension-activations/:id');

  server.post('/course-extension-activations/reorder', function (schema, request) {
    const { repository_id, positions } = JSON.parse(request.requestBody);

    schema.courseExtensionActivations.where({ repositoryId: repository_id }).models.forEach((activation, index) => {
      activation.update({ position: -1000 - index });
    });

    positions.forEach(({ id, position }) => {
      const activation = schema.courseExtensionActivations.find(id);

      if (activation) {
        activation.update({ position });
      }
    });

    return {
      courseExtensionActivations: schema.courseExtensionActivations.where({ repositoryId: repository_id }).models.sortBy('position'),
    };
  });
}
