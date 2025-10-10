export default function (server) {
  server.post('/course-extension-activations', function (schema, request) {
    const attrs = JSON.parse(request.requestBody).courseExtensionActivation;

    // If no position is provided, set it to the next available position
    if (!attrs.position) {
      const existingActivations = schema.courseExtensionActivations.where({ repositoryId: attrs.repositoryId });
      attrs.position = existingActivations.length + 1;
    }

    return server.create('course-extension-activation', attrs);
  });

  server.delete('/course-extension-activations/:id');

  server.post('/course-extension-activations/reorder', function (schema, request) {
    const { positions } = JSON.parse(request.requestBody);

    const updatedActivations = [];

    positions.forEach(({ id, position }) => {
      const activation = schema.courseExtensionActivations.find(id);

      if (activation) {
        activation.update({ position });
        updatedActivations.push(activation);
      }
    });

    return { courseExtensionActivations: updatedActivations };
  });
}
