export default function (server) {
  server.post('/course-extension-activations');

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
