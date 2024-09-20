import { clickOnText, collection, create, triggerable, visitable } from 'ember-cli-page-object';
import LanguageDropdown from 'codecrafters-frontend/tests/pages/components/course-admin/language-dropdown';
import CourseStageDropdown from 'codecrafters-frontend/tests/pages/components/course-admin/course-stage-dropdown';
import codeMirror from 'codecrafters-frontend/tests/pages/components/code-mirror';

export default create({
  clickOnLink: clickOnText(),

  diffTab: {
    changedFiles: collection('[data-test-changed-file]', {
      codeMirror,
    }),

    scope: '[data-test-diff-tab]',
  },

  languageDropdown: LanguageDropdown,
  stageDropdown: CourseStageDropdown,

  submissionDetails: {
    commitSha: {
      copyButton: {
        hover: triggerable('mouseenter'),
        scope: '[data-test-copy-commit-sha-button]',
      },

      scope: '[data-test-commit-sha]',
    },

    treeSha: {
      copyButton: {
        hover: triggerable('mouseenter'),
        scope: '[data-test-copy-tree-sha-button]',
      },

      scope: '[data-test-tree-sha]',
    },

    userProficiencyInfoIcon: {
      hover: triggerable('mouseenter'),
      scope: '[data-test-user-proficiency-info-icon]',
    },

    scope: '[data-test-submission-details]',

    testerVersion: {
      scope: '[data-test-tester-version]',
    },
  },

  timelineContainer: {
    entries: collection('[data-test-timeline-entry]', {}),
    scope: '[data-test-timeline-container]',
  },

  visit: visitable('/courses/:course_slug/admin/submissions'),
});
