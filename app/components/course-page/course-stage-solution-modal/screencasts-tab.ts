import Component from '@glimmer/component';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;
}

export default class ScreencastsTabComponent extends Component<Signature> {
  @tracked embedHtml: string | undefined;
  @service declare store: Store;

  get screencastUrls() {
    return [
      'https://www.youtube.com/watch?v=XSqteQFaHBA&ab_channel=RaghavDua',
      'https://vimeo.com/725342679',
      'https://www.youtube.com/watch?v=Lhmyb3vD3P0',
      'https://www.loom.com/share/1dd746eaaba34bc2b5459ad929934c08?sid=a5f6ec60-5ae4-4e9c-9566-33235d483431',
    ];
  }

  get courseStageScreencasts() {
    return this.store
      .peekAll('course-stage-screencast')
      .filter((screencast) => this.screencastUrls.includes(screencast.originalUrl))
      .sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }

  @action
  async handleDidInsert() {
    this.screencastUrls.forEach(async (screencastUrl) => {
      const screencast = this.store.peekAll('course-stage-screencast').find((screencast) => screencast.originalUrl === screencastUrl);
      if (!screencast) {
        const iframelyJson = await this.fetchIframelyJson(screencastUrl);

        this.store.createRecord('course-stage-screencast', {
          authorName: iframelyJson.meta.author,
          canonicalUrl: iframelyJson.meta.canonical,
          createdAt: new Date(iframelyJson.meta.date),
          description: iframelyJson.meta.description,
          durationInSeconds: iframelyJson.meta.duration,
          embedHtml: iframelyJson.html,
          originalUrl: screencastUrl,
          sourceIconUrl: iframelyJson.links.icon[0].href,
          thumbnailUrl: iframelyJson.links.thumbnail[0].href,
          title: iframelyJson.meta.title,
        });
      }
    });
  }

  async fetchIframelyJson(screencastUrl: string) {
    const params = new URLSearchParams();
    params.set('url', screencastUrl);
    params.set('key', '3aafd05f43d700b9a7382620ac7cdfa3');
    params.set('click_to_play', '1');
    // params.set('card', 'small');
    params.set('iframe', '1');
    params.set('omit_script', '1');

    const response = await fetch(`http://cdn.iframe.ly/api/iframely?${params.toString()}`);
    return await response.json();
  }
}
