export default function (server) {
  server.post('/concept-questions', function (schema) {
    const attrs = this.normalizedRequestAttrs();

    return schema.conceptQuestions.create({
      conceptId: attrs.conceptId,
      slug: 'new',
      queryMarkdown: 'New Question?',
      options: [
        { markdown: 'Option 1', is_correct: true, explanation_markdown: 'Explanation 1' },
        { markdown: 'Option 2', is_correct: false, explanation_markdown: 'Explanation 2' },
      ],
    });
  });

  server.patch('/concept-questions/:id');
}
