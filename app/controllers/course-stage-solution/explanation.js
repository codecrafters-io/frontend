import Controller from '@ember/controller';
import Prism from 'prismjs';
import showdown from 'showdown';
import { htmlSafe } from '@ember/template';
import { action } from '@ember/object';

export default class CourseStageSolutionExplanationController extends Controller {
  get explanationHtml() {
    return htmlSafe(new showdown.Converter().makeHtml(this.explanationMarkdown));
  }

  get explanationMarkdown() {
    return `
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
    `;
  }

  @action
  handleDidInsertExplanationHTML(element) {
    Prism.highlightAllUnder(element);
  }
}
