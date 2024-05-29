import { Response } from 'miragejs';

export default function (server) {
  server.get('/concepts');

  server.post('/concepts', function (schema) {
    return schema.concepts.create({ title: 'New Concept', slug: 'new-concept' });
  });

  server.patch('/concepts/:id', function (schema, request) {
    const concept = schema.concepts.find(request.params.id);
    const attrs = this.normalizedRequestAttrs();

    if (typeof attrs.title === 'string' && attrs.title.trim() === '') {
      return new Response(
        422,
        {},
        {
          errors: [
            {
              status: '422',
              detail: 'Title cannot be empty',
              source: { pointer: '/data/attributes/title' },
            },
          ],
        },
      );
    }

    if (typeof attrs.slug === 'string' && attrs.slug.trim() === '') {
      return new Response(
        422,
        {},
        {
          errors: [
            {
              status: '422',
              detail: 'Slug cannot be empty',
              source: { pointer: '/data/attributes/slug' },
            },
          ],
        },
      );
    }

    concept.update(attrs);

    return concept;
  });

  server.post('/concepts/:id/update-blocks', function (schema, request) {
    const concept = schema.concepts.find(request.params.id);
    const jsonBody = JSON.parse(request.requestBody);

    const oldBlocksFromRequest = jsonBody['old-blocks'];
    const oldBlocksFromConcept = concept.blocks;

    const serializedOldBlocksFromRequest = JSON.stringify(oldBlocksFromRequest);
    const serializedOldBlocksFromConcept = JSON.stringify(oldBlocksFromConcept);

    if (serializedOldBlocksFromRequest !== serializedOldBlocksFromConcept) {
      return new Response(
        400,
        {},
        {
          errors: [
            {
              detail: `Old blocks from request do not match old blocks from concept. Provided: ${serializedOldBlocksFromRequest}. Expected: ${serializedOldBlocksFromConcept}`,
            },
          ],
        },
      );
    }

    concept.update({ blocks: jsonBody['new-blocks'] });

    return concept;
  });
}
