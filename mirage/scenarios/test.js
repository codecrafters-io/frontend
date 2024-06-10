import createCourseFromData from 'codecrafters-frontend/mirage/utils/create-course-from-data';
import createCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-course-stage-solution';
import createLanguages from 'codecrafters-frontend/mirage/utils/create-languages';
import bittorrentCourseData from 'codecrafters-frontend/mirage/course-fixtures/bittorrent';
import dnsServerCourseData from 'codecrafters-frontend/mirage/course-fixtures/dns-server';
import dockerCourseData from 'codecrafters-frontend/mirage/course-fixtures/docker';
import dummyCourseData from 'codecrafters-frontend/mirage/course-fixtures/dummy';
import gitCourseData from 'codecrafters-frontend/mirage/course-fixtures/git';
import grepCourseData from 'codecrafters-frontend/mirage/course-fixtures/grep';
import httpServerCourseData from 'codecrafters-frontend/mirage/course-fixtures/http-server';
import redisCourseData from 'codecrafters-frontend/mirage/course-fixtures/redis';
import shellCourseData from 'codecrafters-frontend/mirage/course-fixtures/shell';
import sqliteCourseData from 'codecrafters-frontend/mirage/course-fixtures/sqlite';

export default function (
  server,
  courses = ['redis', 'bittorrent', 'dns-server', 'docker', 'dummy', 'git', 'grep', 'http-server', 'shell', 'sqlite'],
) {
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
    bittorrent: bittorrentCourseData,
    'dns-server': dnsServerCourseData,
    docker: dockerCourseData,
    dummy: dummyCourseData,
    git: gitCourseData,
    grep: grepCourseData,
    'http-server': httpServerCourseData,
    redis: redisCourseData,
    shell: shellCourseData,
    sqlite: sqliteCourseData,
  };

  courses.forEach((courseSlug) => {
    if (!courseToDataMap[courseSlug]) {
      throw new Error(`Course data not found for ${courseSlug}`);
    }

    createCourseFromData(server, courseToDataMap[courseSlug]);
  });

  const redis = server.schema.courses.findBy({ slug: 'redis' });

  // TODO: Do this for all courses?
  if (redis) {
    createCourseStageSolution(server, redis, 1);
  }
}
