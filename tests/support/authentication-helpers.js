export function signIn(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');

  let serverVariables = owner.lookup('service:serverVariables');

  serverVariables.set('currentUserPayload', {
    data: {
      type: 'users',
      id: user.id,
      attributes: {
        'avatar-url': user.avatarUrl,
        'created-at': user.createdAt.toISOString(),
        'github-username': user.githubUsername,
        'is-admin': user.isAdmin,
        'is-staff': user.isStaff,
        username: user.username,
      },
    },
    included: buildIncludedResources(user),
  });
}

export function signInAsAdmin(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  user.update('isAdmin', true);

  signIn(owner, server, user);
}

export function signInAsStaff(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  user.update('isStaff', true);

  signIn(owner, server, user);
}

export function signInAsSubscriber(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  server.create('subscription', { user: user });

  signIn(owner, server, user);
}

export function signInAsTeamAdmin(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  const team = server.create('team', { id: 'dummy-team-id', name: 'Dummy Team' });

  server.create('team-membership', {
    createdAt: new Date(),
    id: 'dummy-team-membership-id',
    user: user,
    team: team,
    isAdmin: true,
  });

  signIn(owner, server, user);
}

export function signInAsTeamMember(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  const team = server.create('team', { id: 'dummy-team-id', name: 'Dummy Team' });

  server.create('team-membership', {
    createdAt: new Date(),
    id: 'dummy-team-membership-id',
    user: user,
    team: team,
    isAdmin: false,
  });

  signIn(owner, server, user);
}

export function signInAsSubscribedTeamMember(owner, server) {
  const user = server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  const team = server.create('team', { id: 'dummy-team-id', name: 'Dummy Team' });

  server.schema.teamSubscriptions.create({ team: team });

  server.create('team-membership', {
    createdAt: new Date(),
    id: 'dummy-team-membership-id',
    user: user,
    team: team,
    isAdmin: false,
  });

  signIn(owner, server, user);
}

function buildIncludedResources(user) {
  let includedResources = [];

  user.featureSuggestions.models.forEach((featureSuggestion) => {
    includedResources.push({
      id: featureSuggestion.id,
      type: 'feature-suggestions',
      attributes: {
        'feature-slug': featureSuggestion.featureSlug,
        'dismissed-at': featureSuggestion.dismissedAt ? featureSuggestion.dismissedAt.toISOString() : null,
      },
      relationships: {
        user: { data: { type: 'users', id: user.id } },
      },
    });
  });

  user.subscriptions.models.forEach((subscription) => {
    includedResources.push({
      id: subscription.id,
      type: 'subscriptions',
      attributes: {
        'start-date': subscription.startDate.toISOString(),
        'ended-at': null,
        'stripe-subscription-id': 'testing',
      },
      relationships: {
        user: { data: { type: 'users', id: user.id } },
      },
    });
  });

  user.teamMemberships.models.forEach((teamMembership) => {
    includedResources.push({
      id: teamMembership.id,
      type: 'team-memberships',
      attributes: {
        'is-admin': teamMembership.isAdmin,
        'created-at': teamMembership.createdAt.toISOString(),
      },
      relationships: {
        user: { data: { type: 'users', id: teamMembership.user.id } },
        team: { data: { type: 'teams', id: teamMembership.team.id } },
      },
    });

    includedResources.push({
      id: teamMembership.team.id,
      type: 'teams',
      attributes: {
        name: teamMembership.team.name,
      },
    });

    teamMembership.team.subscriptions.models.forEach((teamSubscription) => {
      includedResources.push({
        id: teamSubscription.id,
        type: 'team-subscriptions',
        attributes: {
          'is-legacy': false,
        },
        relationships: {
          team: { data: { type: 'teams', id: teamSubscription.team.id } },
        },
      });
    });
  });

  return includedResources;
}
