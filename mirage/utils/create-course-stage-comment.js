export default function createCourseStageComment(server, course, stagePosition) {
  let stage = course.stages.models.filter((stage) => stage.position === stagePosition).firstObject;

  server.create('course-stage-comment', {
    user: server.schema.users.first(),
    bodyMarkdown: 'This is a comment',
    target: stage,
    isApprovedByModerator: true,
  });
}
