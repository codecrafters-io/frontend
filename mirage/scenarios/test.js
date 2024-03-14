import createCourseFromData from 'codecrafters-frontend/mirage/utils/create-course-from-data';
import createCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-course-stage-solution';
import createLanguages from 'codecrafters-frontend/mirage/utils/create-languages';
import dockerCourseData from 'codecrafters-frontend/mirage/course-fixtures/docker';
import dummyCourseData from 'codecrafters-frontend/mirage/course-fixtures/dummy';
import gitCourseData from 'codecrafters-frontend/mirage/course-fixtures/git';
import grepCourseData from 'codecrafters-frontend/mirage/course-fixtures/grep';
import redisCourseData from 'codecrafters-frontend/mirage/course-fixtures/redis';
import sqliteCourseData from 'codecrafters-frontend/mirage/course-fixtures/sqlite';

export default function (server, courses = ['redis', 'docker', 'dummy', 'git', 'grep', 'sqlite']) {
  server.create('user', {
    id: '63c51e91-e448-4ea9-821b-a80415f266d3',
    avatarUrl: 'https://github.com/rohitpaulk.png',
    createdAt: new Date('2019-01-01T00:00:00.000Z'),
    githubUsername: 'rohitpaulk',
    username: 'rohitpaulk',
    name: 'Paul Kuruvilla',
    authoredCourseSlugs: [],
  });

  createLanguages(server);

  const courseToDataMap = {
    docker: dockerCourseData,
    dummy: dummyCourseData,
    git: gitCourseData,
    grep: grepCourseData,
    redis: redisCourseData,
    sqlite: sqliteCourseData,
  };

  courses.forEach((courseSlug) => {
    if (!courseToDataMap[courseSlug]) {
      throw new Error(`Course data not found for ${courseSlug}`);
    }

    console.time(`createCourseFromData ${courseSlug}`);
    createCourseFromData(server, courseToDataMap[courseSlug]);
    console.timeEnd(`createCourseFromData ${courseSlug}`);
  });

  const redis = server.schema.courses.findBy({ slug: 'redis' });

  // TODO: Do this for all courses?
  if (redis) {
    createCourseStageSolution(server, redis, 1);
  }
}
