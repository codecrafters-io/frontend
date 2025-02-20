export default function (server) {
  server.get('/concept-groups', function (schema, request) {
    if (request.queryParams.slug) {
      return schema.conceptGroups.where({ slug: request.queryParams.slug });
    }

    return schema.conceptGroups.all();
  });

  server.get('/concept-groups/:concept_group_slug', function (schema, request) {
    let result = schema.conceptGroups.where({ slug: request.params.concept_group_slug });

    if (result.models.length === 0) {
      return new Response(404, {}, { errors: ['Concept group not found'] });
    }

    return result.models[0];
  });
}
