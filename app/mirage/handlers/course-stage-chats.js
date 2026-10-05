import { Response } from 'miragejs';

const EXPERIMENT_DISABLED = new Response(404, {}, { error: 'experiment_disabled' });

export default function (server) {
  server.get('/experiments/course-stage-chats', () => EXPERIMENT_DISABLED);
  server.post('/experiments/course-stage-chat-messages', () => EXPERIMENT_DISABLED);
  server.patch('/experiments/course-stage-chat-messages/:id', () => EXPERIMENT_DISABLED);
}
