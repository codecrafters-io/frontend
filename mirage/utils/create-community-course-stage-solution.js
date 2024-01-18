export default function createCourseStageSolution(server, course, stagePosition, language) {
  let stage = course.stages.models.filter((stage) => stage.position === stagePosition)[0];

  return server.create('community-course-stage-solution', {
    user: server.schema.users.first(),
    changedFiles: [
      {
        filename: 'README.md',
        diff: `This is the README.md file.

- and this was removed!
+ and this was added!
          `,
      },
      {
        filename: 'server.rb',
        diff: `    end

    def listen
      loop do
        client = @server.accept
+       handle_client(client)
+     end
+   end
+
+   def handle_client(client)
+     loop do
+       client.gets
+
        # TODO: Handle commands other than PING
        client.write("+PONG\\r\\n")
      end
    end
  end`,
      },
    ],
    courseStage: stage,
    language: language,
  });
}
