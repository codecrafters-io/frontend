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
  releasedAt: Date;
  title: string;
  type: 'challenge' | 'extension';
}

export default class LatestReleasesCardComponent extends Component<Signature> {
  get releases(): Release[] {
    const releases: Release[] = [];

    this.args.courseExtensionIdeas
      .filter((idea: CourseExtensionIdeaModel) => idea.developmentStatusIsReleased)
      .forEach((idea: CourseExtensionIdeaModel) => {
        releases.push({
          announcementUrl: idea.announcementUrl!,
          releasedAt: idea.releasedAt!,
          title: `${idea.course.shortName} / ${idea.name}`,
          type: 'extension',
        });
      });

    this.args.courseIdeas
      .filter((idea: CourseIdeaModel) => idea.developmentStatusIsReleased)
      .forEach((idea: CourseIdeaModel) => {
        releases.push({
          announcementUrl: idea.announcementUrl!,
          releasedAt: idea.releasedAt!,
          title: idea.name,
          type: 'challenge',
        });
      });

    return releases.sort((a, b) => b.releasedAt.getTime() - a.releasedAt.getTime()).slice(0, 5);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LatestReleasesCard: typeof LatestReleasesCardComponent;
  }
}
