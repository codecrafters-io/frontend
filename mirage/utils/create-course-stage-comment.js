export default function createCourseStageComment(server, course, stagePosition) {
  let stage = course.stages.models.find((stage) => stage.position === stagePosition);

  server.create('course-stage-comment', {
    user: server.schema.users.first(),
    bodyMarkdown: 'This is a comment',
    target: stage,
    isApprovedByModerator: true,
  });
}
