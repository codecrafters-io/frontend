export function signIn(owner) {
  doSignIn(owner, {});
}

export function signInAsBetaParticipant(owner) {
  doSignIn(owner, { 'is-beta-participant': true });
}

export function signInAsSubscriber(owner) {
  doSignIn(owner, {}, [
    {
      id: '1',
      type: 'subscriptions',
      attributes: {
        'start-date': '2021-12-27T00:49:11.608608',
        'ended-at': null,
        'stripe-subscription-id': 'testing',
      },
      relationships: {
        user: {
          data: {
            type: 'users',
            id: '63c51e91-e448-4ea9-821b-a80415f266d3',
          },
        },
      },
    },
  ]);
}

function doSignIn(owner, userAttributes, includedResources) {
  let serverVariables = owner.lookup('service:serverVariables');

  serverVariables.set('currentUserPayload', {
    data: {
      type: 'users',
      id: '63c51e91-e448-4ea9-821b-a80415f266d3',
      attributes: {
        'avatar-url': 'https://github.com/rohitpaulk2.png',
        'created-at': '2021-08-29T16:50:12.551986+00:00',
        'github-username': 'rohitpaulk',
        'is-beta-participant': false,
        'has-active-subscription': false,
        username: 'rohitpaulk',
        ...userAttributes,
      },
    },
    included: includedResources || [],
  });
}
