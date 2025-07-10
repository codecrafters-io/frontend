import Component from '@glimmer/component';
import type CourseExtensionIdeaModel from 'codecrafters-frontend/models/course-extension-idea';
import type CourseIdeaModel from 'codecrafters-frontend/models/course-idea';

interface Signature {
  Element: HTMLDivElement;
  Args: {
    courseExtensionIdeas: CourseExtensionIdeaModel[];
    courseIdeas: CourseIdeaModel[];
  };
}

interface Release {
  announcementUrl?: string;
  releaseDate: Date;
  title: string;
  type: 'extension' | 'challenge';
}

export default class LatestReleasesComponent extends Component<Signature> {
  get releases(): Release[] {
    const releases: Release[] = [];

    this.args.courseExtensionIdeas.forEach((idea: CourseExtensionIdeaModel) => {
      if (idea.releasedAt) {
        releases.push({
          type: 'extension',
          title: `${idea.course.shortName} / ${idea.name}`,
          releaseDate: idea.releasedAt,
          announcementUrl: idea.announcementUrl || undefined,
        });
      }
    });

    this.args.courseIdeas.forEach((idea: CourseIdeaModel) => {
      if (idea.releasedAt) {
        releases.push({
          type: 'challenge',
          title: idea.name,
          releaseDate: idea.releasedAt,
          announcementUrl: idea.announcementUrl || undefined,
        });
      }
    });

    return releases.sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime()).slice(0, 5);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LatestReleases: typeof LatestReleasesComponent;
  }
}
