export async function signIn(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');

  if (!user) {
    throw new Error('signIn expects a user to be present. Are you sure you are calling signIn after testScenario?');
  }

  const session = server.schema.sessions.create({ user: user, id: 'current-session-id', token: crypto.randomUUID() });

  const sessionTokenStorageService = owner.lookup('service:session-token-storage');
  sessionTokenStorageService.setToken(session.token);
}

export async function signInAsAdmin(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  user.update('isAdmin', true);

  await signIn(owner, server, user);
}

export async function signInAsAffiliate(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  user.update('isAffiliate', true);

  await signIn(owner, server, user);
}

export async function signInAsCourseAuthor(owner, server, course, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  user.update('authoredCourseSlugs', [course.slug]);

  await signInAsSubscriber(owner, server, user);
}

export async function signInAsStaff(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  user.update('isStaff', true);

  await signIn(owner, server, user);
}

export async function signInAsSubscriber(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');

  server.create('subscription', {
    user: user,
    pricingPlanName: 'Monthly',
    currentPeriodEnd: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  });

  await signIn(owner, server, user);
}

export async function signInAsTeamAdmin(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  const team = server.create('team', { id: 'dummy-team-id', name: 'Dummy Team' });

  server.create('team-membership', {
    createdAt: new Date(),
    id: 'dummy-team-membership-id',
    user: user,
    team: team,
    isAdmin: true,
  });

  await signIn(owner, server, user);
}

export async function signInAsTeamMember(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  const team = server.create('team', { id: 'dummy-team-id', name: 'Dummy Team' });

  server.create('team-membership', {
    createdAt: new Date(),
    id: 'dummy-team-membership-id',
    user: user,
    team: team,
    isAdmin: false,
  });

  await signIn(owner, server, user);
}

export async function signInAsSubscribedTeamMember(owner, server) {
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

  await signIn(owner, server, user);
}

export async function signInAsTrialingSubscriber(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');

  server.create('subscription', {
    currentPeriodEnd: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    user: user,
    pricingPlanName: 'Monthly',
    trialEnd: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  });

  await signIn(owner, server, user);
}
