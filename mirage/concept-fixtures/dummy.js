export default {
  data: {
    id: '7da83b89-2de7-4fc5-85d3-4bf680dc01ef',
    type: 'concepts',
    attributes: {
      blocks: [
        { args: { markdown: 'Hello, world!' }, type: 'markdown' },
        { args: {}, type: 'click_to_continue' },
        { args: { markdown: 'Hello world 2!' }, type: 'markdown' },
        { args: {}, type: 'click_to_continue' },
        { args: { concept_question_slug: 'dummy-q' }, type: 'concept_question' },
        { args: { markdown: "And that's the end!" }, type: 'markdown' },
        { args: {}, type: 'click_to_continue' },
      ],
      'description-markdown': 'This is used for tests.',
      slug: 'dummy',
      title: 'Dummy Concept',
    },
    relationships: {
      author: { data: { id: '8373d847-7cea-457c-94e2-7a1769d51cd6', type: 'users' } },
      questions: { data: [{ id: '4e032a49-34aa-4635-97b8-52b46e66db20', type: 'concept-questions' }] },
    },
  },
  included: [
    {
      id: '4e032a49-34aa-4635-97b8-52b46e66db20',
      type: 'concept-questions',
      attributes: {
        'query-markdown': "What's the question?",
        options: [
          { markdown: 'Wrong answer', is_correct: false, explanation_markdown: null },
          { markdown: 'Correct', is_correct: true, explanation_markdown: null },
        ],
        slug: 'dummy-q',
      },
      relationships: { concept: {} },
    },
  ],
};
