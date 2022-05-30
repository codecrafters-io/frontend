export default function createRedisStage3Solution(server) {
  let redis = server.schema.courses.findBy({ slug: 'redis' });

  server.create('course-stage-solution', {
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
    courseStage: redis.stages.models.filter((stage) => stage.slug === 'ping-pong-multiple').firstObject,
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
    language: server.schema.languages.findBy({ slug: 'go' }),
  });
}
