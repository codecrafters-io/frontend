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

  server.create('subscription', {
    user: user,
    pricingPlanName: 'Monthly',
    currentPeriodEnd: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  });

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

export function signInAsTrialingSubscriber(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');

  server.create('subscription', {
    currentPeriodEnd: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    user: user,
    pricingPlanName: 'Monthly',
    trialEnd: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
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

  user.freeUsageRestrictions.models.forEach((freeUsageRestriction) => {
    includedResources.push({
      id: freeUsageRestriction.id,
      type: 'free-usage-restrictions',
      attributes: {
        'expires-at': freeUsageRestriction.expiresAt.toISOString(),
      },
      relationships: {
        user: { data: { type: 'users', id: user.id } },
      },
    });
  });

  user.referralActivationsAsCustomer.models.forEach((referralActivation) => {
    includedResources.push({
      id: referralActivation.id,
      type: 'referral-activations',
      attributes: {
        'activated-at': referralActivation.activatedAt.toISOString(),
      },
      relationships: {
        customer: { data: { type: 'users', id: referralActivation.customer.id } },
        referrer: { data: { type: 'users', id: referralActivation.referrer.id } },
      },
    });
  });

  user.referralLinks.models.forEach((referralLink) => {
    includedResources.push({
      id: referralLink.id,
      type: 'referral-links',
      attributes: {
        slug: referralLink.slug,
        url: referralLink.url,
        'unique-viewer-count': referralLink.uniqueViewerCount,
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
        'pricing-plan-name': subscription.pricingPlanName,
        'stripe-subscription-id': 'testing',
        'trial-end': subscription.trialEnd ? subscription.trialEnd.toISOString() : null,
        'current-period-end': subscription.currentPeriodEnd.toISOString(),
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

    teamMembership.team.pilots.models.forEach((teamPilot) => {
      includedResources.push({
        id: teamPilot.id,
        type: 'team-pilots',
        attributes: {
          'end-date': teamPilot.endDate.toISOString(),
          'requires-payment-method': teamPilot.requiresPaymentMethod,
        },
        relationships: {
          team: { data: { type: 'teams', id: teamPilot.team.id } },
        },
      });
    });

    teamMembership.team.paymentMethods.models.forEach((teamPaymentMethod) => {
      includedResources.push({
        id: teamPaymentMethod.id,
        type: 'team-payment-methods',
        relationships: {
          team: { data: { type: 'teams', id: teamPaymentMethod.team.id } },
          creator: { data: { type: 'users', id: teamPaymentMethod.creator.id } },
        },
      });
    });
  });

  return includedResources;
}
