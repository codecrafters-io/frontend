export default function createCourseStageSolution(server, course, stagePosition, language) {
  let stage = course.stages.models.filter((stage) => stage.position === stagePosition).firstObject;

  return server.create('community-course-stage-solution', {
    user: server.schema.users.first(),
    changedFiles: [
      {
        filename: 'README.md',
        diff: `This is the README.md file.

- this was removed!
+ and this was added!

Here's a very very long line that should overflow the container and cause a scrollbar to appear. If it wasn't long enough before, now it should be.
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
