export default function (server) {
  server.get('/concept-groups', function (schema) {
    return schema.conceptGroups.all();
  });

  server.get('/concept-groups/:concept_group_slug', function (schema, request) {
    let result = schema.conceptGroups.where({ slug: request.params.concept_group_slug });

    return result.models[0];
  });
}
