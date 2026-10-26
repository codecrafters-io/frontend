import CallControls from 'codecrafters-frontend/tests/pages/components/course-interview-page/call-controls';
import CaptionsPanel from 'codecrafters-frontend/tests/pages/components/course-interview-page/captions-panel';
import CodePanel from 'codecrafters-frontend/tests/pages/components/course-interview-page/code-panel';
import Header from 'codecrafters-frontend/tests/pages/components/header';
import Lobby from 'codecrafters-frontend/tests/pages/components/course-interview-page/lobby';
import Report from 'codecrafters-frontend/tests/pages/components/course-interview-page/report';
import TopBar from 'codecrafters-frontend/tests/pages/components/course-interview-page/top-bar';
import VoiceOrb from 'codecrafters-frontend/tests/pages/components/course-interview-page/voice-orb';
import createPage from 'codecrafters-frontend/tests/support/create-page';
import { clickable, text, visitable } from 'ember-cli-page-object';

export default createPage({
  callControls: CallControls,
  captionsPanel: CaptionsPanel,
  codePanel: CodePanel,

  failedScreen: {
    clickOnTryAgainButton: clickable('[data-test-try-again-button]'),
    descriptionText: text('[data-test-status-screen-description]'),
    scope: '[data-test-failed-screen]',
  },

  footer: { scope: '[data-test-footer]' },
  header: Header,
  lobby: Lobby,
  report: Report,
  topBar: TopBar,
  visit: visitable('/courses/:course_slug/interview/:milestone_slug'),
  voiceOrb: VoiceOrb,
});
