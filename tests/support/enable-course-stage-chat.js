import { get } from '@ember/object';

function queryFilter(request, key) {
  return request.queryParams[`filter[${key}]`];
}

function completePendingUserMessages(schema, chat) {
  chat.messages.models
    .filter((message) => message.role === 'user' && message.status === 'pending')
    .forEach((userMessage) => {
      userMessage.update({ status: 'complete' });

      const hasAssistantReply = chat.messages.models.some(
        (message) => message.role === 'assistant' && new Date(message.createdAt) > new Date(userMessage.createdAt),
      );

      if (!hasAssistantReply) {
        schema.courseStageChatMessages.create({
          body: 'Here is an answer about this stage.',
          chat,
          courseStage: chat.courseStage,
          createdAt: new Date(new Date(userMessage.createdAt).getTime() + 1000),
          rating: null,
          refused: false,
          repository: chat.repository,
          role: 'assistant',
          status: 'complete',
        });
      }
    });
}

export const DEFAULT_RESEARCH_SOURCES = [
  { name: 'Redis docs', url_prefix: 'https://redis.io' },
  { name: 'CodeCrafters forum', url_prefix: 'https://forum.codecrafters.io' },
];

export default function enableCourseStageChat(server, options = {}) {
  const availableResearchSources = options.availableResearchSources || DEFAULT_RESEARCH_SOURCES;

  server.get('/experiments/course-stage-chats', function (schema, request) {
    const repositoryId = queryFilter(request, 'repository');
    const courseStageId = queryFilter(request, 'course-stage');

    let chats = schema.courseStageChats.all();

    if (repositoryId) {
      chats = chats.filter((chat) => chat.repositoryId.toString() === repositoryId.toString());
    }

    if (courseStageId) {
      chats = chats.filter((chat) => chat.courseStageId.toString() === courseStageId.toString());
    }

    chats.models.forEach((chat) => completePendingUserMessages(schema, chat));

    const json = this.serialize(chats);

    json.meta = {
      'available-research-sources': availableResearchSources,
    };

    return json;
  });

  server.post('/experiments/course-stage-chat-messages', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    const repositoryId = attrs.repositoryId;
    const courseStageId = attrs.courseStageId;

    let chat = schema.courseStageChats.find((item) => get(item, { repositoryId, courseStageId }));

    if (!chat) {
      chat = schema.courseStageChats.create({
        courseStageId,
        repositoryId,
      });
    }

    return schema.courseStageChatMessages.create({
      body: attrs.body,
      chat,
      courseStageId,
      createdAt: new Date(),
      inputMode: attrs.inputMode || 'text',
      rating: null,
      refused: false,
      repositoryId,
      researchSourceNames: attrs.researchSourceNames,
      role: 'user',
      status: 'pending',
    });
  });

  server.patch('/experiments/course-stage-chat-messages/:id', function (schema, request) {
    const attrs = this.normalizedRequestAttrs();
    const message = schema.courseStageChatMessages.find(request.params.id);

    return message.update({ rating: attrs.rating ?? null });
  });
}
