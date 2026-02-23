import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import type CourseModel from 'codecrafters-frontend/models/course';
import type Store from '@ember-data/store';
import { service } from '@ember/service';

export interface ModelType {
  course: CourseModel;
}

export default class CourseNextIndexRoute extends BaseRoute {
  @service declare store: Store;

  buildRouteInfoMetadata() {
    return new RouteInfoMetadata({ colorScheme: RouteColorScheme.Both });
  }

  async model(): Promise<ModelType> {
    const courses = await this.store.findAll('course', {
      include: 'extensions,stages,language-configurations.language',
    });

    const courseSlug = (this.paramsFor('course-next')! as { course_slug: string }).course_slug;

    return {
      course: courses.find((course) => course.slug === courseSlug),
    };
  }
}
