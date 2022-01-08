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

export function signInAsTeamAdmin(owner, server) {
  const user = server.schema.users.first();
  const team = server.create('team', { id: 'dummy-team-id', name: 'Dummy Team' });

  const teamMembership = server.create('team-membership', {
    createdAt: new Date(),
    id: 'dummy-team-membership-id',
    user: user,
    team: team,
    isAdmin: true,
  });

  doSignIn(owner, {}, [
    {
      id: teamMembership.id,
      type: 'team-memberships',
      attributes: {
        'is-admin': teamMembership.isAdmin,
        'created-at': '2021-08-29T16:50:12.551986+00:00',
      },
      relationships: {
        user: { data: { type: 'users', id: user.id } },
        team: { data: { type: 'teams', id: team.id } },
      },
    },
    {
      id: team.id,
      type: 'teams',
      attributes: {
        name: team.name,
      },
    },
  ]);
}

export function signInAsTeamMember(owner, server) {
  const user = server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  const team = server.create('team', { id: 'dummy-team-id', name: 'Dummy Team' });
  const teamMembership = server.create('team-membership', { id: 'dummy-team-membership-id', user: user, team: user, isAdmin: false });

  doSignIn(owner, {}, [
    {
      id: teamMembership.id,
      type: 'team-memberships',
      attributes: {
        'created-at': '2021-08-29T16:50:12.551986+00:00',
        'is-admin': teamMembership.isAdmin,
      },
      relationships: {
        user: { data: { type: 'users', id: user.id } },
        team: { data: { type: 'teams', id: team.id } },
      },
    },
    {
      id: team.id,
      type: 'teams',
      attributes: {
        name: team.name,
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
        'avatar-url': 'https://github.com/rohitpaulk.png',
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
