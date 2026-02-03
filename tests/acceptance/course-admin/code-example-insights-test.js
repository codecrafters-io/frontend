import { visit } from '@ember/test-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import { module, test } from 'qunit';

module('Acceptance | course-admin | code-example-insights', function (hooks) {
  setupApplicationTest(hooks);

  test('defaults to highlight size sorting', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const course = this.server.schema.courses.findBy({ slug: 'redis' });
    const language = this.server.schema.languages.findBy({ name: 'C' });
    const stage = course.stages.models.toSorted(fieldComparator('position'))[0];

    createCommunityCourseStageSolution(this.server, course, stage.position, language);

    await visit(`/courses/${course.slug}/admin/code-examples/stage/${stage.slug}?language_slug=${language.slug}`);
    const matchingRequest = this.server.pretender.handledRequests.find((request) => {
      return new URL(request.url).pathname === '/api/v1/community-course-stage-solutions/for-admin';
    });

    assert.ok(matchingRequest, 'Expected request to admin code examples endpoint');
    assert.strictEqual(new URL(matchingRequest.url).searchParams.get('order'), 'shortest_highlights');
  });
});
