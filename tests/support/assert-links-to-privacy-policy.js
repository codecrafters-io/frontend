export default function assertLinksToPrivacyPolicy(assert, recordingNotice, where) {
  assert.strictEqual(recordingNotice.privacyPolicyLineText, 'For more, see our Privacy Policy.', `${where} has the privacy line on its own`);
  assert.strictEqual(recordingNotice.privacyPolicyLinkHref, 'https://codecrafters.io/privacy', `${where} links to the privacy policy`);
  assert.strictEqual(recordingNotice.privacyPolicyLinkTarget, '_blank', `${where} opens it in a new tab`);
}
