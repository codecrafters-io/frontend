import CodePanel from 'codecrafters-frontend/tests/pages/components/course-interview-page/code-panel';
import CompetitionLobby from 'codecrafters-frontend/tests/pages/components/course-interview-page/competition-lobby';
import Header from 'codecrafters-frontend/tests/pages/components/header';
import Report from 'codecrafters-frontend/tests/pages/components/course-interview-page/report';
import TopBar from 'codecrafters-frontend/tests/pages/components/course-interview-page/top-bar';
import createPage from 'codecrafters-frontend/tests/support/create-page';
import { clickable, text, visitable } from 'ember-cli-page-object';

export default createPage({
  codePanel: CodePanel,
  competitionCard: { scope: '[data-test-competition-card]' },
  competitionLobby: CompetitionLobby,

  failedScreen: {
    backToChallengeButton: { scope: '[data-test-back-to-challenge-button]' },
    clickOnTryAgainButton: clickable('[data-test-try-again-button]'),
    descriptionText: text('[data-test-status-screen-description]'),
    scope: '[data-test-failed-screen]',
    tryAgainButton: { scope: '[data-test-try-again-button]' },
  },

  footer: { scope: '[data-test-footer]' },
  header: Header,
  report: Report,

  submittedScreen: {
    descriptionText: text('[data-test-status-screen-description]'),
    scope: '[data-test-submitted-screen]',
  },

  topBar: TopBar,
  visit: visitable('/courses/:course_slug/quiz/:competition_slug'),
});
