export default function createCommunitySolutionComment(server, communitySolution) {
  server.create('community-course-stage-solution-comment', {
    user: server.schema.users.first(),
    bodyMarkdown: 'This is a comment',
    target: communitySolution,
    approvalStatus: 'approved',
    subtargetLocator: `${communitySolution.changedFiles[0].filename}:1-3`,
  });
}
