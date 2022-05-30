import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import Prism from 'prismjs';
import 'prismjs/plugins/diff-highlight/prism-diff-highlight';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-diff';

export default class SyntaxHighlightedCodeComponent extends Component {
  get code() {
    return `    end

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
  end`;
  }

  get highlightedHtml() {
    return htmlSafe(Prism.highlight(this.code, Prism.languages.diff, 'diff-ruby'));
  }
}
