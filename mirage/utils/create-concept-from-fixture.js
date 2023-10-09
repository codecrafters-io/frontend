export default function createConceptFromFixture(server, conceptFixture) {
  const conceptAttributes = conceptFixture.data.attributes;

  const concept = server.create('concept', {
    title: conceptAttributes['title'],
    slug: conceptAttributes['slug'],
    descriptionMarkdown: conceptAttributes['description-markdown'],
    blocks: conceptAttributes['blocks'],
  });

  const questionIds = conceptFixture.data.relationships.questions.data.map((relationship) => relationship.id);

  conceptFixture.included.forEach((included) => {
    if (included.type == 'concept-questions' && questionIds.includes(included.id)) {
      server.create('concept-question', {
        concept: concept,
        slug: included.attributes['slug'],
        queryMarkdown: included.attributes['query-markdown'],
        options: included.attributes['options'],
      });
    }
  });

  // There's a bug with loading lottie.js in tests, let's prune animation blocks until that's fixed
  concept.update({ blocks: concept.blocks.filter((block) => block.type !== 'concept_animation') });

  return concept;
}
