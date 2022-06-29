import createCourseFromData from 'codecrafters-frontend/mirage/utils/create-course-from-data';
import createLanguages from 'codecrafters-frontend/mirage/utils/create-languages';
import createRedisStageSolution from 'codecrafters-frontend/mirage/utils/create-redis-stage-solution';
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

  // TODO: Fetch this programmatically
  createRedisStageSolution(server, 1);
  createRedisStageSolution(server, 2);
  createRedisStageSolution(server, 3);
  createRedisStageSolution(server, 4);
  createRedisStageSolution(server, 5);
}
