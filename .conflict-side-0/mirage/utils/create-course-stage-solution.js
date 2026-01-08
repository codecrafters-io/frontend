export default function createCourseStageSolution(server, course, stagePosition, language) {
  let stage = course.stages.models.filter((stage) => stage.position === stagePosition)[0];
  // eslint-disable-next-line ember/no-array-prototype-extensions
  language = language || server.schema.languages.findBy({ slug: 'go' });

  return server.create('course-stage-solution', {
    authorDetails: {
      name: 'Paul Kuruvilla',
      profileUrl: 'https://github.com/rohitpaulk',
      avatarUrl: 'https://github.com/rohitpaulk.png',
      headline: 'CTO, CodeCrafters',
    },
    reviewersDetails: [
      {
        name: 'Marcos Lilljedahl',
        profileUrl: 'https://www.docker.com/captains/marcos-lilljedahl/',
        avatarUrl: 'https://github.com/marcosnils.png',
        headline: 'Docker Contributor',
      },
    ],
    changedFiles: [
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
