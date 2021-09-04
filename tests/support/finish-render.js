import { getSettledState, waitUntil } from '@ember/test-helpers';

export default function finishRender() {
  // Checks for everything except hasPendingTimers
  //
  // Based on this article: https://dockyard.com/blog/2018/04/18/bending-time-in-ember-tests
  return waitUntil(() => {
    let { hasRunLoop, hasPendingRequests, hasPendingWaiters, hasPendingTransitions } = getSettledState();
    return !(hasRunLoop || hasPendingRequests || hasPendingWaiters || hasPendingTransitions);
  });
}
