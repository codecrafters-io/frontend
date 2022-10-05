export default function createCourseStageSourceWalkthrough(server, course, stagePosition, slug) {
  let courseStage = course.stages.models.filter((stage) => stage.position === stagePosition).firstObject;

  const codeWalkthrough = server.create('code-walkthrough', {
    sections: [
      {
        type: 'prose',
        markdown: "Here's how Redis does this. [ping_command](https://github.com/redis/redis)",
      },
      {
        type: 'referenced_code',
        language_slug: 'c',
        code: `void pingCommand(client *c) {
    /* The command takes zero or one arguments. */
    if (c->argc > 2) {
        addReplyErrorArity(c);
        return;
    }

    if (c->flags & CLIENT_PUBSUB && c->resp == 2) {
        addReply(c,shared.mbulkhdr[2]);
        addReplyBulkCBuffer(c,"pong",4);
        if (c->argc == 1)
            addReplyBulkCBuffer(c,"",0);
        else
            addReplyBulk(c,c->argv[1]);
    } else {
        if (c->argc == 1)
            addReply(c,shared.pong);
        else
            addReplyBulk(c,c->argv[1]);
    }
}
`,
        file_path: 'app/server.c',
        link: 'https://github.com',
      },
      {
        type: 'prose',
        markdown: "Here's how Redis does this.",
      },
    ],

    slug: slug,
  });

  courseStage.update('sourceWalkthrough', codeWalkthrough);
}
