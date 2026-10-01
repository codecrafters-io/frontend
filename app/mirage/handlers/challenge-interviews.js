import config from 'codecrafters-frontend/config/environment';
import { readyInterviewAttributes, scoredInterviewReport } from 'codecrafters-frontend/mirage/data/challenge-interview-fixtures';

export default function (server) {
  const previousUrlPrefix = server.urlPrefix;
  const previousNamespace = server.namespace;

  server.urlPrefix = config.x.interviewServiceUrl;
  server.namespace = '/api';

  server.get('/challenge-interviews', function (schema, request) {
    const { milestone_slug: milestoneSlug, repository_id: repositoryId } = request.queryParams;

    return schema.challengeInterviews.where((interview) => interview.repositoryId === repositoryId && interview.milestoneSlug === milestoneSlug);
  });

  // Advances one status per poll so the frontend exercises its generating and scoring states.
  server.get('/challenge-interviews/:id', function (schema, request) {
    const interview = schema.challengeInterviews.find(request.params.id);

    if (interview.status === 'generating') {
      interview.update(readyInterviewAttributes);
    } else if (interview.status === 'scoring') {
      interview.update({ report: scoredInterviewReport, status: 'scored' });
    }

    return interview;
  });

  server.post('/challenge-interviews', function (schema) {
    const attrs = this.normalizedRequestAttrs('challenge-interview');

    return schema.challengeInterviews.create({ ...attrs, createdAt: new Date(), status: 'generating' });
  });

  server.post('/challenge-interviews/:id/ended', function (schema, request) {
    const interview = schema.challengeInterviews.find(request.params.id);
    const { conversation_id: conversationId, end_reason: endReason } = JSON.parse(request.requestBody);

    if (!conversationId) {
      interview.update({
        conversationId: null,
        conversationToken: null,
        endReason,
        errorMessage: "The call never connected, so there's nothing to score. Please try again.",
        status: 'failed',
      });

      return interview;
    }

    interview.update({ conversationId, conversationToken: null, endReason, status: 'scoring' });

    return interview;
  });

  server.urlPrefix = previousUrlPrefix;
  server.namespace = previousNamespace;
}
