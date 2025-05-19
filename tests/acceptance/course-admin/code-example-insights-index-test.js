// import { module, test } from 'qunit';
// import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
// import codeExampleInsightsIndexPage from 'codecrafters-frontend/tests/pages/course-admin/code-example-insights-index-page';
// import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
// import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
// import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
// import createLanguages from 'codecrafters-frontend/mirage/utils/create-languages';
// import createCourseFromData from 'codecrafters-frontend/mirage/utils/create-course-from-data';

// // 1. Visiting /courses/shell/admin/code-examples should redirect to ?language_slug=c for the first language in the list
// // 2. Language dropdown should work
// // 3. Clicking on a stage should redirect to the code example insights page for that stage
// module('Acceptance | course-admin | code-example-insights-index', function (hooks) {
//   setupApplicationTest(hooks);

//   hooks.beforeEach(function () {
//     testScenario(this.server);
//     signInAsStaff(this.owner, this.server);

//     this.currentUser = this.server.schema.users.first();
//     this.language = this.server.schema.languages.findBy({ name: 'Python' });
//     this.course = this.server.schema.courses.findBy({ slug: 'redis' });
//     this.courseStage = this.course.stages.models.sortBy('position')[0];

//     this.solution1 = createCommunityCourseStageSolution(this.server, this.course, 2, this.language);
//     this.solution2 = createCommunityCourseStageSolution(this.server, this.course, 2, this.language);

//     this.server.create('community-solution-analysis', {
//       communitySolution: this.solution2,
//       evaluator: this.evaluator,
//       result: 'fail',
//     });
//   });

//   test('shows empty state when no stages', async function (assert) {
//     testScenario(this.server);
//     signInAsStaff(this.owner, this.server);

//     // Create a course with one language but no stages
//     createLanguages(this.server);
//     const language = this.server.schema.languages.findBy({ slug: 'python' });
//     const course = createCourseFromData(this.server, {
//       slug: 'test-course',
//       title: 'Test Course',
//       stages: [],
//       extensions: [],
//       betaOrLiveLanguages: [language],
//     });

//     await codeExampleInsightsIndexPage.visit({ course_slug: course.slug, language_slug: language.slug });
//     assert.ok(codeExampleInsightsIndexPage.noStagesFoundMessageIsVisible, 'Shows no stages found message');
//   });

//   test('renders stages and extensions for selected language', async function (assert) {
//     testScenario(this.server);
//     signInAsStaff(this.owner, this.server);

//     // Create language and course with stages/extensions
//     createLanguages(this.server);
//     const language = this.server.schema.languages.findBy({ slug: 'python' });
//     const course = createCourseFromData(this.server, {
//       slug: 'test-course',
//       title: 'Test Course',
//       stages: [
//         { name: 'Stage 1', slug: 'stage-1' },
//         { name: 'Stage 2', slug: 'stage-2' },
//       ],
//       extensions: [
//         {
//           name: 'Extension 1',
//           slug: 'extension-1',
//           stages: [{ name: 'Ext Stage 1', slug: 'ext-stage-1' }],
//         },
//       ],
//       betaOrLiveLanguages: [language],
//     });

//     await codeExampleInsightsIndexPage.visit({ course_slug: course.slug, language_slug: language.slug });

//     assert.strictEqual(codeExampleInsightsIndexPage.stageListItems.length, 2, 'Shows base stages');
//     assert.strictEqual(codeExampleInsightsIndexPage.extensionHeaders.length, 1, 'Shows extension header');
//     assert.ok(codeExampleInsightsIndexPage.extensionHeaders[0].text.includes('Extension 1'), 'Extension header text is correct');
//   });
// });
