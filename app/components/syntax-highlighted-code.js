import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import go from 'highlight.js/lib/languages/go';
import diff from 'highlight.js/lib/languages/diff';
import hljs from 'highlight.js/lib/core';

hljs.registerLanguage('diff', diff);
hljs.registerLanguage('go', go);

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
    return htmlSafe(hljs.highlight('diff', this.code).value);
  }
}
