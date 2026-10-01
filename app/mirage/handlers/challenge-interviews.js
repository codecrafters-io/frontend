import config from 'codecrafters-frontend/config/environment';
import { Response } from 'miragejs';
import { readyInterviewAttributes, readyQuizAttributes, scoredInterviewReport } from 'codecrafters-frontend/mirage/data/challenge-interview-fixtures';

function withInterviewId(interview) {
  if (interview.agentVariables) {
    interview.update({ agentVariables: { ...interview.agentVariables, interview_id: interview.id } });
  }

  return interview;
}

export default function (server) {
  const previousUrlPrefix = server.urlPrefix;
  const previousNamespace = server.namespace;

  server.urlPrefix = config.x.interviewServiceUrl;
  server.namespace = '/api';

  server.get('/partner-competitions', function (schema, request) {
    return schema.partnerCompetitions.where((competition) => competition.courseSlugs.includes(request.queryParams.course_slug));
  });

  server.get('/challenge-interviews', function (schema, request) {
    const { competition_slug: competitionSlug, milestone_slug: milestoneSlug, repository_id: repositoryId } = request.queryParams;

    if (competitionSlug) {
      return schema.challengeInterviews.where((interview) => interview.competitionSlug === competitionSlug);
    }

    return schema.challengeInterviews.where((interview) => interview.repositoryId === repositoryId && interview.milestoneSlug === milestoneSlug);
  });

  // Advances one status per poll so the frontend exercises its generating and scoring states.
  server.get('/challenge-interviews/:id', function (schema, request) {
    const interview = schema.challengeInterviews.find(request.params.id);
    const isQuiz = interview.format === 'competition';

    if (interview.status === 'generating') {
      interview.update(isQuiz ? readyQuizAttributes : readyInterviewAttributes);
    } else if (interview.status === 'scoring') {
      interview.update({ report: isQuiz ? null : scoredInterviewReport, status: 'scored' });
    }

    return withInterviewId(interview);
  });

  server.post('/challenge-interviews', function (schema) {
    const attrs = this.normalizedRequestAttrs('challenge-interview');
    const format = attrs.competitionSlug ? 'competition' : 'practice';

    return schema.challengeInterviews.create({ ...attrs, createdAt: new Date(), format, isSubmitted: false, status: 'generating' });
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

    interview.update({ conversationId, conversationToken: null, endReason, isSubmitted: true, status: 'scoring' });

    return interview;
  });

  server.get('/competition-quizzes', function (schema, request) {
    return schema.competitionQuizzes.where((quiz) => quiz.courseSlug === request.queryParams.course_slug);
  });

  server.get('/competition-quizzes/:id');

  server.patch('/competition-quizzes/:id', function (schema, request) {
    const quiz = schema.competitionQuizzes.find(request.params.id);
    const attributes = JSON.parse(request.requestBody).data.attributes;
    const reviewDecision = attributes['review-decision'] || null;
    const reviewNote = attributes['review-note'] || null;
    const hasReview = reviewDecision !== null || reviewNote !== null;

    quiz.update({
      reviewDecision,
      reviewNote,
      reviewedAt: hasReview ? new Date() : null,
      reviewedBy: hasReview ? schema.users.first().username : null,
    });

    return quiz;
  });

  server.get('/competition-quizzes/:id/audio', () => new Response(200, { 'Content-Type': 'audio/mpeg' }, 'fake-audio'));

  server.urlPrefix = previousUrlPrefix;
  server.namespace = previousNamespace;
}
