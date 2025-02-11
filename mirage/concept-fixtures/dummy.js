export default {
  data: {
    id: '7da83b89-2de7-4fc5-85d3-4bf680dc01ef',
    type: 'concepts',
    attributes: {
      blocks: [
        { args: { markdown: 'Hello, world!' }, type: 'markdown' },
        { args: {}, type: 'click_to_continue' },
        { args: { markdown: '### Variable assignment with `if` expressions\n\nYou can also assign the result of an `if` expression.\n\nIn the example below, `weather` is getting assigned by the result of the `if` expression.\n\n```rust\nlet temperature = 15;\n\nlet weather = if temperature <= 10 {\n      "cold"\n} else if temperature <= 20 {\n      "cool"\n} else {\n      "warm"\n};,\n\nprintln!("The weather is {}", weather); // "The weather is cool"\n```' }, type: 'markdown' },
        { args: {}, type: 'click_to_continue' },
        { args: { concept_question_slug: 'dummy-q' }, type: 'concept_question' },
        { args: { markdown: "And that's the end!" }, type: 'markdown' },
        { args: {}, type: 'click_to_continue' },
      ],
      'description-markdown': 'This is used for tests.',
      slug: 'dummy',
      title: 'Dummy Concept',
      status: 'published',
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
        'query-markdown': "What's the question?\n\n```rust\nlet temperature = 15;\n\nlet weather = if temperature <= 10 {\n      \"cold\"\n} else if temperature <= 20 {\n      \"cool\"\n} else {\n      \"warm\"\n};,\n\nprintln!(\"The weather is {}\", weather); // \"The weather is cool\"\n```",
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
