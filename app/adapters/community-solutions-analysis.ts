import config from 'codecrafters-frontend/config/environment';
import ApplicationAdapter from './application';

// TODO: Can't use adapters
export default class CommunitySolutionsAnalysisAdapter extends ApplicationAdapter {
  urlForQuery(query: Record<string, unknown>): string {
    console.log('query "adapter"', query);

    const courseSlug = query['course_slug'];
    delete query['course_slug'];

    const languageSlug = query['language_slug'];
    delete query['language_slug'];

    return `${config.x.backendUrl}/api/v1/community-solutions-analyses/course/${courseSlug}/language/${languageSlug}`;
  }
} 