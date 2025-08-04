export function signIn(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');

  if (!user) {
    throw new Error('signIn expects a user to be present. Are you sure you are calling signIn after testScenario?');
  }

  const session = server.schema.sessions.create({ user: user, id: 'current-session-id', token: crypto.randomUUID() });

  const sessionTokenStorageService = owner.lookup('service:session-token-storage');
  sessionTokenStorageService.setToken(session.token);

  return user;
}

export function signInAsAdmin(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  user.update('isAdmin', true);

  return signIn(owner, server, user);
}

export function signInAsAffiliate(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  user.update('isAffiliate', true);

  return signIn(owner, server, user);
}

export function signInAsConceptAuthor(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  user.update('isConceptAuthor', true);

  return signIn(owner, server, user);
}

export function signInAsCourseAuthor(owner, server, course, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  user.update('authoredCourseSlugs', [course.slug]);

  return signInAsSubscriber(owner, server, user);
}

export function signInAsStaff(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  user.update('isStaff', true);

  return signIn(owner, server, user);
}

export function signInAsSubscriber(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');

  server.create('subscription', {
    cancelAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    user: user,
  });

  return signIn(owner, server, user);
}

export function signInAsVipUser(owner, server, user) {
  user = user || server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
  user.update('isVip', true);
  user.update('vipStatusExpiresAt', new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30)); // 30 days from now

  return signIn(owner, server, user);
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

  return signIn(owner, server, user);
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

  return signIn(owner, server, user);
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

  return signIn(owner, server, user);
}
