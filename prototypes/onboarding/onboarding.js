(() => {
  const goals = [
    {
      value: 'systems',
      title: 'Understand how systems work',
      description: 'Get inside the tools you use every day.',
      icon: 'server',
      order: ['redis', 'kafka', 'sqlite'],
      reason: 'You want to understand the internals. Start with networking, commands, and persistence in a database you build yourself.',
    },
    {
      value: 'new-language',
      title: 'Learn a new language',
      description: 'Put new syntax to work on a real project.',
      icon: 'code',
      order: ['http-server', 'shell', 'redis'],
      reason: 'You want to learn a language. Put it to work on a focused project with requests, responses, and real tests.',
    },
    {
      value: 'deepen',
      title: 'Go deeper in my language',
      description: 'Move beyond the basics. Build with confidence.',
      icon: 'cube-transparent',
      order: ['redis', 'git', 'sqlite'],
      reason: 'You want to go deeper in your language. Practice protocols, networking, and persistence by building a database.',
    },
    {
      value: 'portfolio',
      title: 'Build portfolio projects',
      description: 'Create something substantial from scratch.',
      icon: 'briefcase',
      order: ['git', 'redis', 'http-server'],
      reason: 'You want a substantial project. Build your own version of a tool developers use every day.',
    },
    {
      value: 'interviews',
      title: 'Prepare for interviews',
      description: 'Practice systems fundamentals by building.',
      icon: 'academic-cap',
      order: ['redis', 'kafka', 'http-server'],
      reason: 'You want stronger systems fundamentals. Practice networking, protocols, and storage in code.',
    },
    {
      value: 'explore',
      title: 'Follow my curiosity',
      description: 'Explore and see what clicks.',
      icon: 'beaker',
      order: [],
      reason: '',
    },
    {
      value: 'other',
      title: 'Something else',
      description: 'Tell us in your own words.',
      icon: 'plus',
      order: [],
      reason: '',
    },
  ];
  const referralSources = [
    'YouTube',
    'GitHub',
    'Google',
    'Reddit',
    'Hacker News',
    'LinkedIn',
    'Twitter / X',
    'Instagram',
    'Facebook',
    'TikTok',
    'Friend or colleague',
    'Newsletter',
    'Other',
    "Don't remember",
  ];
  const roles = ['Backend', 'Full-stack', 'Frontend', 'ML or Data', 'Student', 'Engineering manager', 'Other'];
  const experienceRanges = ['<2', '2\u20135', '5\u201310', '10+'];
  const companySizes = ['Just me or freelance', '2\u201350', '51\u2013500', '500+', 'Student'];
  const challenges = {
    'http-server': {
      title: 'HTTP server',
      description: 'Turn raw requests into real responses. Build the networking foundations behind the web.',
      topics: ['TCP', 'HTTP', 'Request parsing'],
      stage: 'Bind to a port',
      stageCopy: 'Start a TCP server that listens for connections on port 4221.',
      code: 'GET / HTTP/1.1',
    },
    redis: {
      title: 'Redis',
      description: 'Build an in-memory database, from your first TCP connection to commands and persistence.',
      topics: ['TCP servers', 'Redis protocol', 'Persistence'],
      stage: 'Bind to a port',
      stageCopy: 'Start a TCP server that listens for connections on port 6379.',
      code: 'SET curiosity unlimited',
    },
    kafka: {
      title: 'Kafka',
      description: 'Build a Kafka broker and get inside the protocol behind event streaming.',
      topics: ['Message queues', 'Wire protocols', 'Storage'],
      stage: 'Bind to a port',
      stageCopy: 'Start a TCP server that listens for connections on port 9092.',
      code: 'producer -> broker -> consumer',
    },
    sqlite: {
      title: 'SQLite',
      description: 'Look beneath a SQL query. Read database pages and work through the structure of a storage engine.',
      topics: ['SQL', 'B-trees', 'Database files'],
      stage: 'Print the page size',
      stageCopy: 'Read the database header and extract the size of a page.',
      code: 'SELECT * FROM curiosity;',
    },
    'claude-code': {
      title: 'Claude Code',
      description: 'Build a coding assistant and explore how language models use tools to get work done.',
      topics: ['LLM APIs', 'Tool calling', 'Agent loops'],
      stage: 'Make an API request',
      stageCopy: 'Connect your program to a language model and read its response.',
      code: 'prompt -> tool -> feedback',
    },
    git: {
      title: 'Git',
      description: 'Find out what lives inside .git. Read objects and build the internals of version control.',
      topics: ['Git objects', 'Hashing', 'Commits'],
      stage: 'Initialize the .git directory',
      stageCopy: 'Create the directory structure and configuration for a Git repository.',
      code: 'git cat-file -p curiosity',
    },
    shell: {
      title: 'Shell',
      description: 'Make a command line of your own. Parse commands, run programs, and connect them together.',
      topics: ['Parsing', 'Processes', 'Shell builtins'],
      stage: 'Print a prompt',
      stageCopy: 'Print a prompt and wait for the user to enter a command.',
      code: '$ echo hello, internals',
    },
  };
  const defaultOrder = Object.keys(challenges);
  const roleOrder = {
    Backend: ['kafka', 'redis', 'http-server'],
    'Full-stack': ['redis', 'http-server', 'sqlite'],
    Frontend: ['http-server', 'git', 'redis'],
    'ML or Data': ['sqlite', 'claude-code', 'kafka'],
    Student: ['shell', 'http-server', 'git'],
    'Engineering manager': ['kafka', 'redis', 'sqlite'],
  };
  const roleReasons = {
    Backend: 'Explore the networking and storage behind a backend system.',
    'Full-stack': 'Go beneath the application layer and build the database behind it.',
    Frontend: 'Follow a browser request into the server and build what happens next.',
    'ML or Data': 'Explore how a database reads, organizes, and retrieves the data you work with.',
    Student: 'Start with a tool you can use right away, one small command at a time.',
    'Engineering manager': 'Explore the implementation behind event streaming and system architecture.',
  };
  const form = document.getElementById('personalization-form');
  const profile = {
    goal: '',
    otherGoal: '',
    role: '',
    experience: '',
    companySize: '',
    referral: '',
    otherReferral: '',
  };
  const isReturning = new URLSearchParams(location.search).get('view') === 'returning';
  let personalized = false;
  let customOrder = true;
  let promptDismissed = false;
  const $ = (id) => document.getElementById(id);
  const name = (slug) => `Build your own ${challenges[slug].title}`;
  const logo = (slug) => `../../public/assets/images/challenge-logos/challenge-logo-${slug}.svg`;

  const text = (tag, value, className) => {
    const element = document.createElement(tag);
    element.textContent = value;
    if (className) element.className = className;

    return element;
  };

  function addChoices(container, field, values, years = false) {
    values.forEach((value) => {
      const label = document.createElement('label');
      label.className = 'choice';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = field;
      input.value = value;
      label.append(input, text('span', value));
      if (years) label.append(text('small', 'years'));
      $(container).append(label);
    });
  }

  addChoices('role-options', 'role', roles);
  addChoices('experience-options', 'experience', experienceRanges, true);
  addChoices('company-options', 'companySize', companySizes);

  goals.forEach((goal) => {
    const label = document.createElement('label');
    label.className = 'choice goal-choice';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'goal';
    input.value = goal.value;
    const icon = document.createElement('img');
    icon.src = `../../public/assets/images/heroicons/outline/${goal.icon}-outline.svg`;
    icon.alt = '';
    const copy = text('span', '', 'goal-copy');
    copy.append(text('strong', goal.title), text('small', goal.description));
    label.append(input, icon, copy);
    $('goal-options').append(label);
  });
  addChoices('referral-options', 'referral', referralSources);
  const selectedGoal = () => goals.find((goal) => goal.value === profile.goal);

  function orderedSlugs() {
    let first = roleOrder[profile.role] || [];
    if (profile.role === 'Backend' && ['<2', '2\u20135'].includes(profile.experience)) first = ['redis', 'http-server', 'kafka'];
    if (!first.length && profile.experience === '10+') first = ['redis', 'kafka', 'sqlite'];
    const goalOrder = selectedGoal()?.order || [];

    return [...new Set([...goalOrder.slice(0, 1), ...first, ...goalOrder.slice(1), ...defaultOrder])];
  }

  const hasRecommendation = () =>
    Boolean(selectedGoal()?.order.length) || Boolean(profile.role && profile.role !== 'Other') || Boolean(profile.experience);

  function reason() {
    if (selectedGoal()?.reason) return selectedGoal().reason;
    if (profile.role === 'Backend' && profile.experience === '<2')
      return 'Build a backend service around a small command set, then grow into persistence and networking.';

    return roleReasons[profile.role] || 'Explore a real system through small stages, with test feedback as you build.';
  }

  function updatePreview() {
    const slug = orderedSlugs()[0];
    $('preview-logo').src = logo(slug);
    $('preview-title').textContent = name(slug);
    $('preview-label').textContent = hasRecommendation() ? 'First in your personalized catalog' : 'A preview of what comes next';
    $('preview-reason').textContent = hasRecommendation() ? reason() : 'Your answers bring relevant challenges to the front.';
    form.querySelectorAll('[data-clear]').forEach((button) => {
      button.hidden = !profile[button.dataset.clear];
    });
  }

  function tags(container, values) {
    container.replaceChildren(...values.map((value) => text('span', value)));
  }

  function showForm() {
    showPersonalizationStep('goal');
    $('catalog').hidden = true;
    $('personalization').hidden = false;
    $('welcome-text').textContent = isReturning ? 'Welcome back to CodeCrafters' : 'Welcome to CodeCrafters';
    updatePreview();
    $('goal-heading').focus();
    window.scrollTo(0, 0);
  }

  function showPersonalizationStep(step) {
    $('goal-step').hidden = step !== 'goal';
    $('profile-step').hidden = step !== 'profile';
    $('step-status').textContent = step === 'goal' ? '1 of 2' : '2 of 2';
    $(step === 'goal' ? 'goal-heading' : 'personalization-heading').focus();
    window.scrollTo(0, 0);
  }

  function renderGuidance() {
    const experience = profile.experience;
    $('starting-guidance').hidden = !personalized || !experience;
    const concise = ['5\u201310', '10+'].includes(experience);
    $('starting-guidance').open = !concise;
    $('guidance-summary').textContent = concise ? 'First-stage guidance, if you need it' : 'A little help getting started';
    $('guidance-copy').textContent = concise
      ? 'Go straight into the internals. The same stage-by-stage instructions and hints are here whenever you want them.'
      : 'Get one small thing working first. Each stage gives you a concrete target, test feedback, and hints when you need them.';
  }

  function renderCatalog() {
    $('personalization').hidden = true;
    $('catalog').hidden = false;
    const recommended = personalized && hasRecommendation();
    const slugs = recommended && customOrder ? orderedSlugs() : defaultOrder;
    $('returning-prompt').hidden = !isReturning || promptDismissed;
    $('catalog-heading').textContent = recommended ? 'Your next build starts here.' : 'Choose your next build.';
    $('catalog-description').textContent = recommended
      ? 'A starting point based on your preferences. Every challenge is still yours to explore.'
      : 'Rebuild a real tool, one tested stage at a time.';
    const summary = [
      profile.goal && profile.goal !== 'other' ? selectedGoal().title : '',
      profile.role,
      profile.experience ? `${profile.experience} years professionally` : '',
    ].filter(Boolean);
    $('preference-summary').hidden = !personalized || !summary.length;
    tags($('preference-summary'), summary);
    $('featured-challenge').hidden = !recommended;
    const first = orderedSlugs()[0];

    if (recommended) {
      $('featured-title').textContent = name(first);
      $('featured-reason').textContent = reason();
      $('featured-logo').src = logo(first);
      $('featured-code').textContent = challenges[first].code;
      tags($('featured-topics'), challenges[first].topics);
      $('featured-open').onclick = () => openChallenge(first);
    }

    renderGuidance();
    $('grid-heading').textContent = recommended && customOrder ? 'All challenges, ordered for you' : 'All challenges';
    $('reset-order').hidden = !recommended;
    $('reset-order').textContent = customOrder ? 'Use default order' : 'Use personalized order';
    $('challenge-grid').replaceChildren(
      ...slugs.map((slug) => {
        const challenge = challenges[slug];
        const card = text('article', '', 'challenge-card');
        const img = document.createElement('img');
        img.src = logo(slug);
        img.alt = '';
        img.width = 44;
        img.height = 44;
        const heading = text('h3', '');
        const button = text('button', name(slug), 'challenge-link');
        button.type = 'button';
        button.onclick = () => openChallenge(slug);
        heading.append(button);
        const topics = text('div', '', 'card-topics');
        topics.textContent = challenge.topics.join(' / ');
        card.append(img, heading, text('p', challenge.description), topics);

        return card;
      }),
    );
  }

  function showCatalog() {
    renderCatalog();
    $('catalog-heading').focus();
    window.scrollTo(0, 0);
  }

  function openChallenge(slug) {
    const challenge = challenges[slug];
    $('dialog-title').textContent = name(slug);
    $('dialog-description').textContent = challenge.description;
    $('dialog-logo').src = logo(slug);
    tags($('dialog-topics'), challenge.topics);
    $('dialog-stage').textContent = challenge.stage;
    $('dialog-stage-copy').textContent = challenge.stageCopy;
    $('challenge-dialog').showModal();
  }

  $('goal-form').addEventListener('change', (event) => {
    if (event.target.name !== 'goal') return;
    profile.goal = event.target.value;
    $('other-goal-field').hidden = profile.goal !== 'other';
    $('clear-goal').hidden = !profile.goal;
    updatePreview();
  });
  $('other-goal').addEventListener('input', (event) => {
    profile.otherGoal = event.target.value;
  });
  $('goal-form').addEventListener('submit', (event) => {
    event.preventDefault();
    showPersonalizationStep('profile');
  });
  $('skip-goal').addEventListener('click', () => {
    clearGoal();
    showPersonalizationStep('profile');
  });

  function clearGoal() {
    const checked = $('goal-form').querySelector('input[name="goal"]:checked');
    if (checked) checked.checked = false;
    profile.goal = '';
    profile.otherGoal = '';
    $('other-goal').value = '';
    $('other-goal-field').hidden = true;
    $('clear-goal').hidden = true;
    updatePreview();
  }

  $('clear-goal').addEventListener('click', () => {
    clearGoal();
    $('goal-options').querySelector('input').focus();
  });
  $('back-to-goal').addEventListener('click', () => showPersonalizationStep('goal'));
  $('referral-form').addEventListener('change', (event) => {
    if (event.target.name !== 'referral') return;
    profile.referral = event.target.value;
    $('other-referral-field').hidden = profile.referral !== 'Other';
  });
  $('other-referral').addEventListener('input', (event) => {
    profile.otherReferral = event.target.value;
  });
  $('referral-form').addEventListener('submit', (event) => {
    event.preventDefault();
    $('referral-question').hidden = true;
    $('referral-answer').hidden = false;
    $('referral-thanks').textContent = profile.referral ? 'Thanks for sharing how you found us.' : 'You can answer this anytime.';
    $('edit-referral').textContent = profile.referral ? 'Edit answer' : 'Answer question';
    $('edit-referral').focus();
  });
  $('skip-referral').addEventListener('click', () => {
    $('referral-question').open = false;
    $('referral-question').querySelector('summary').focus();
  });
  $('edit-referral').addEventListener('click', () => {
    $('referral-question').hidden = false;
    $('referral-answer').hidden = true;
    $('referral-question').open = true;
    $('referral-question').querySelector('summary').focus();
  });
  form.addEventListener('change', (event) => {
    if (Object.hasOwn(profile, event.target.name)) {
      profile[event.target.name] = event.target.value;
      updatePreview();
    }
  });
  form.querySelectorAll('[data-clear]').forEach((button) =>
    button.addEventListener('click', () => {
      const field = button.dataset.clear;
      const checked = form.querySelector(`input[name="${field}"]:checked`);
      if (checked) checked.checked = false;
      profile[field] = '';
      updatePreview();
      form.querySelector(`input[name="${field}"]`).focus();
    }),
  );
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    personalized = true;
    customOrder = true;
    promptDismissed = true;
    showCatalog();
  });
  $('skip-personalization').addEventListener('click', () => {
    personalized = false;
    promptDismissed = true;
    showCatalog();
  });
  $('edit-preferences').addEventListener('click', showForm);
  $('returning-personalize').addEventListener('click', showForm);
  $('dismiss-prompt').addEventListener('click', () => {
    promptDismissed = true;
    renderCatalog();
    $('catalog-heading').focus();
  });
  $('reset-order').addEventListener('click', () => {
    customOrder = !customOrder;
    renderCatalog();
  });
  ['close-dialog', 'back-to-catalog'].forEach((id) => $(id).addEventListener('click', () => $('challenge-dialog').close()));
  $('restart-demo').addEventListener('click', () => {
    location.href = isReturning ? '?view=returning' : '?view=signup';
  });
  if (isReturning) {
    $('signup-demo').removeAttribute('aria-current');
    $('returning-demo').setAttribute('aria-current', 'page');
    renderCatalog();
  } else updatePreview();
})();
