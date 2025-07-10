import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type Store from '@ember-data/store';
import type CourseExtensionIdeaModel from 'codecrafters-frontend/models/course-extension-idea';
import type CourseIdeaModel from 'codecrafters-frontend/models/course-idea';

interface Signature {
  Element: HTMLDivElement;
}

interface Release {
  timestampText: string;
  type: 'extension' | 'challenge';
  title: string;
  releaseDate: Date;
  announcementUrl?: string;
}

export default class LatestReleasesComponent extends Component<Signature> {
  @service declare store: Store;

  get releases(): Release[] {
    const courseExtensionIdeas = this.store.peekAll('course-extension-idea').filterBy('developmentStatusIsReleased');
    const courseIdeas = this.store.peekAll('course-idea').filterBy('developmentStatusIsReleased');

    const releases: Release[] = [];

    courseExtensionIdeas.forEach((idea: CourseExtensionIdeaModel) => {
      if (idea.releasedAt) {
        releases.push({
          timestampText: this.formatTimestamp(idea.releasedAt),
          type: 'extension',
          title: idea.name,
          releaseDate: idea.releasedAt,
          announcementUrl: idea.announcementUrl || undefined,
        });
      }
    });

    courseIdeas.forEach((idea: CourseIdeaModel) => {
      if (idea.releasedAt) {
        releases.push({
          timestampText: this.formatTimestamp(idea.releasedAt),
          type: 'challenge',
          title: idea.name,
          releaseDate: idea.releasedAt,
          announcementUrl: idea.announcementUrl || undefined,
        });
      }
    });

    return releases.sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime()).slice(0, 5);
  }

  private formatTimestamp(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LatestReleases: typeof LatestReleasesComponent;
  }
}
