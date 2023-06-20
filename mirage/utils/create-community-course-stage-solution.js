export default function createCourseStageSolution(server, course, stagePosition, language) {
  let stage = course.stages.models.filter((stage) => stage.position === stagePosition).firstObject;

  return server.create('community-course-stage-solution', {
    user: server.schema.users.first(),
    changedFiles: [
      {
        filename: 'README.md',
        diff: `This is the README.md file.

- and this was removed!
+ and this was added!

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor.
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
