import createCourseFromData from 'codecrafters-frontend/mirage/utils/create-course-from-data';
import createCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-course-stage-solution';
import createLanguages from 'codecrafters-frontend/mirage/utils/create-languages';
import createCourseStageSourceWalkthrough from 'codecrafters-frontend/mirage/utils/create-course-stage-source-walkthrough';
import dockerCourseData from 'codecrafters-frontend/mirage/course-fixtures/docker';
import gitCourseData from 'codecrafters-frontend/mirage/course-fixtures/git';
import reactCourseData from 'codecrafters-frontend/mirage/course-fixtures/react';
import redisCourseData from 'codecrafters-frontend/mirage/course-fixtures/redis';
import sqliteCourseData from 'codecrafters-frontend/mirage/course-fixtures/sqlite';

export default function (server) {
  server.create('user', {
    id: '63c51e91-e448-4ea9-821b-a80415f266d3',
    avatarUrl: 'https://github.com/rohitpaulk.png',
    createdAt: new Date(),
    githubUsername: 'rohitpaulk',
    username: 'rohitpaulk',
  });

  createLanguages(server);

  createCourseFromData(server, redisCourseData);
  createCourseFromData(server, dockerCourseData);
  createCourseFromData(server, gitCourseData);
  createCourseFromData(server, sqliteCourseData);
  createCourseFromData(server, reactCourseData);

  const redis = server.schema.courses.findBy({ slug: 'redis' });

  // TODO: Fetch this programmatically
  createCourseStageSolution(server, redis, 1);
  createCourseStageSolution(server, redis, 2);
  createCourseStageSolution(server, redis, 3);
  createCourseStageSolution(server, redis, 4);
  createCourseStageSolution(server, redis, 5);

  // TODO: Fetch this programmatically
  createCourseStageSourceWalkthrough(server, redis, 1);
  createCourseStageSourceWalkthrough(server, redis, 2);
}
