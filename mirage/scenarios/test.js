import createCourseFromData from 'codecrafters-frontend/mirage/utils/create-course-from-data';
import createLanguages from 'codecrafters-frontend/mirage/utils/create-languages';
import dockerCourseData from 'codecrafters-frontend/mirage/course-fixtures/docker';
import gitCourseData from 'codecrafters-frontend/mirage/course-fixtures/git';
import reactCourseData from 'codecrafters-frontend/mirage/course-fixtures/react';
import redisCourseData from 'codecrafters-frontend/mirage/course-fixtures/redis';
import sqliteCourseData from 'codecrafters-frontend/mirage/course-fixtures/sqlite';

export default function (server) {
  server.create('user', {
    id: '63c51e91-e448-4ea9-821b-a80415f266d3',
    avatarUrl: 'https://github.com/rohitpaulk.png',
    createdAt: new Date(),
    githubUsername: 'rohitpaulk',
    username: 'rohitpaulk',
  });

  createLanguages(server);

  let redis = createCourseFromData(server, redisCourseData);
  createCourseFromData(server, dockerCourseData);
  createCourseFromData(server, gitCourseData);
  createCourseFromData(server, sqliteCourseData);
  createCourseFromData(server, reactCourseData);

  // TODO: Fetch this programmatically
  server.create('course-stage-solution', {
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
