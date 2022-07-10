import Component from '@glimmer/component';

import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

import 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-nim';
// import 'prismjs/components/prism-php'; Doesn't work for some reason?
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-clojure';
import 'prismjs/components/prism-crystal';
import 'prismjs/components/prism-elixir';
import 'prismjs/components/prism-haskell';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';

import 'prismjs/components/prism-diff';

export default class CourseStageSourceWalkthroughModalComponent extends Component {
  @service store;

  constructor() {
    super(...arguments);

    this.emitAnalyticsEvent();
  }

  emitAnalyticsEvent() {
    this.store
      .createRecord('analytics-event', {
        name: 'viewed_course_stage_source_walkthrough',
        properties: {
          course_slug: this.args.courseStage.course.slug,
          course_stage_slug: this.args.courseStage.slug,
        },
      })
      .save();
  }
}
