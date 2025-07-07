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

    // Add course extension ideas
    courseExtensionIdeas.forEach((idea: CourseExtensionIdeaModel) => {
      // Use releaseDate if available, otherwise fall back to createdAt
      const dateToUse = idea.releaseDate || idea.createdAt;
      
      releases.push({
        timestampText: this.formatTimestamp(dateToUse),
        type: 'extension',
        title: idea.name,
        releaseDate: dateToUse,
        announcementUrl: idea.announcementUrl || undefined,
      });
    });

    // Add course ideas
    courseIdeas.forEach((idea: CourseIdeaModel) => {
      // Use releaseDate if available, otherwise fall back to createdAt
      const dateToUse = idea.releaseDate || idea.createdAt;
      
      releases.push({
        timestampText: this.formatTimestamp(dateToUse),
        type: 'challenge',
        title: idea.name,
        releaseDate: dateToUse,
        announcementUrl: idea.announcementUrl || undefined,
      });
    });

    // Sort by release date (newest first) and take the latest 5
    return releases
      .sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime())
      .slice(0, 5);
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
    'LatestReleases': typeof LatestReleasesComponent;
  }
} 