import { tryLoadAndStartRecorder } from '@alwaysmeticulous/recorder-loader';

export async function initialize() {
  // Start the Meticulous recorder before you initialise your app.
  await tryLoadAndStartRecorder({
    projectId: '0CvDDn8regqg49l5J0o7iDGvsFFan1oWZZOhRkZN',
  });
}

export default {
  initialize,
};
