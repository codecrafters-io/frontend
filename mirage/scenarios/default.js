import createCourseFromData from 'codecrafters-frontend/mirage/utils/create-course-from-data';
import createLanguages from 'codecrafters-frontend/mirage/utils/create-languages';
import dockerCourseData from 'codecrafters-frontend/mirage/course-fixtures/docker';
import gitCourseData from 'codecrafters-frontend/mirage/course-fixtures/git';
import redisCourseData from 'codecrafters-frontend/mirage/course-fixtures/redis';
import sqliteCourseData from 'codecrafters-frontend/mirage/course-fixtures/sqlite';

export default function (server) {
  server.create('user', {
    id: '63c51e91-e448-4ea9-821b-a80415f266d3',
    avatarUrl: 'https://github.com/rohitpaulk.png',
    createdAt: new Date('2019-01-01T00:00:00.000Z'),
    githubName: 'Paul Kuruvilla',
    githubUsername: 'rohitpaulk',
    username: 'rohitpaulk',
    name: 'Paul Kuruvilla',
  });

  createLanguages(server);

  createCourseFromData(server, redisCourseData);
  createCourseFromData(server, dockerCourseData);
  createCourseFromData(server, gitCourseData);
  createCourseFromData(server, sqliteCourseData);
}
