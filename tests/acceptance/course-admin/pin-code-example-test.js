import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import codeExamplesPage from 'codecrafters-frontend/tests/pages/course-admin/code-examples-page';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-admin | pin-examples', function(hooks) {
  setupApplicationTest(hooks);

  test('can pin code example', async function(assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    createCommunityCourseStageSolution(this.server, redis, 2, python);
    const solution2 = createCommunityCourseStageSolution(this.server, redis, 2, go);

    await codeExamplesPage.visit({ course_slug: 'redis', code_example_id: solution2.id });
  });
});
