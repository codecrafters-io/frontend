export default function createCourseStageSolution(server, course, stagePosition, language) {
  let stage = course.stages.models.filter((stage) => stage.position === stagePosition)[0];
  language = language || server.schema.languages.findBy({ slug: 'go' });

  server.create('course-stage-solution', {
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
    explanationMarkdown: `
  To respond to multiple PINGs from the same client, we'll need to run a loop that looks like this:

  - Wait for the client to send a command (which we know will always be \`PING\` for now)
  - Send \`+PONG\\r\\n\` back to the client
  - ... rinse and repeat

  <pre>
    <code class="language-diff-ruby diff-highlight">  def handle_client(client)
  +     loop do
  +       client.gets
  +
  +       # TODO: Handle commands other than PING
  +       client.write("+PONG\\r\\n")
  +     end
      end</code>
  </pre>

## Handling Disconnects

At some point the client will disconnect, and our program needs to gracefully handle
that. Since we can't know _when_ the client will disconnect, we'll just assume the client
is always connected, and then ignore any client disconnection errors like \`ReadTimeout\`
or \`WriteFailed\`.

  <pre>
    <code class="language-diff-ruby diff-highlight">  def handle_client(client)
        loop do
          client.gets
          client.write("+PONG\\r\\n")
        end
  +   rescue IO::WaitReadable, IO::WaitWritable
  +     # Client disconnected, ignore
      end</code>
  </pre>
      `,
    language: language,
  });
}
