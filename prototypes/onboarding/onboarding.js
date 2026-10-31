(() => {
  const assetRoot = '../../public/assets/images/';
  const goals = [
    {
      value: 'systems',
      title: 'Understand how systems work',
      description: 'Get inside the tools you use every day.',
      icon: 'server',
      challenge: 'redis',
    },
    {
      value: 'new-language',
      title: 'Learn a new language',
      description: 'Put new syntax to work on a real project.',
      icon: 'code',
      challenge: 'http-server',
    },
    {
      value: 'deepen',
      title: 'Go deeper in my language',
      description: 'Move beyond the basics. Build with confidence.',
      icon: 'cube-transparent',
      challenge: 'redis',
    },
    {
      value: 'portfolio',
      title: 'Build portfolio projects',
      description: 'Create something substantial from scratch.',
      icon: 'briefcase',
      challenge: 'git',
    },
    {
      value: 'interviews',
      title: 'Prepare for interviews',
      description: 'Practice systems fundamentals by building.',
      icon: 'academic-cap',
      challenge: 'redis',
    },
    { value: 'explore', title: 'Follow my curiosity', description: 'Explore, experiment, and see what clicks.', icon: 'beaker', challenge: 'shell' },
  ];
  const roles = ['Backend', 'Full-stack', 'Frontend', 'ML or Data', 'Student', 'Engineering manager', 'Other'];
  const experienceRanges = ['<2', '2\u20135', '5\u201310', '10+'];
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
  const challenges = {
    redis: {
      name: 'Build your own Redis',
      description: 'Build a working in-memory database. Implement the protocol, handle commands, and make data persistence work.',
      topics: ['TCP servers', 'Redis protocol', 'Data persistence'],
      firstStage: 'Bind to a port',
    },
    'http-server': {
      name: 'Build your own HTTP server',
      description: 'Take a request from raw bytes to a real response. Build the networking foundations behind every web application.',
      topics: ['TCP connections', 'Request parsing', 'HTTP responses'],
      firstStage: 'Bind to a port',
    },
    git: {
      name: 'Build your own Git',
      description: 'Find out what happens inside the .git directory. Read objects, write commits, and build your own version control system.',
      topics: ['Git objects', 'Content hashing', 'Commits'],
      firstStage: 'Initialize the .git directory',
    },
    shell: {
      name: 'Build your own shell',
      description: 'Make a command line of your own. Parse commands, run programs, and discover how a shell connects you to the operating system.',
      topics: ['Command parsing', 'Processes', 'Shell builtins'],
      firstStage: 'Print a prompt',
    },
  };
  const state = { step: 1, goal: '', otherGoal: '', role: '', otherRole: '', experience: '', companySize: '', referral: '', otherReferral: '' };
  const form = document.getElementById('onboarding-form');
  const goalContinue = document.getElementById('goal-continue');
  const aboutContinue = document.getElementById('about-continue');

  const text = (tag, content, className) => {
    const element = document.createElement(tag);
    element.textContent = content;
    if (className) element.className = className;

    return element;
  };

  const image = (path) => {
    const element = document.createElement('img');
    element.src = `${assetRoot}${path}`;
    element.alt = '';

    return element;
  };

  function radioChoice(name, value, className) {
    const label = document.createElement('label');
    label.className = className;
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = name;
    input.value = value;
    label.append(input);

    return label;
  }

  goals.forEach((goal) => {
    const label = radioChoice('goal', goal.value, 'goal-choice');
    const icon = text('span', '', 'choice-icon');
    icon.append(image(`heroicons/outline/${goal.icon}-outline.svg`));
    const indicator = text('span', '', 'choice-indicator');
    indicator.setAttribute('aria-hidden', 'true');
    indicator.append(image('heroicons/outline/check-outline.svg'));
    label.append(icon, text('strong', goal.title), text('span', goal.description, 'choice-description'), indicator);
    document.getElementById('goal-options').append(label);
  });

  roles.forEach((role) => {
    const label = radioChoice('role', role, 'pill-choice');
    label.append(text('span', role));
    document.getElementById('role-options').append(label);
  });

  experienceRanges.forEach((range) => {
    const label = radioChoice('experience', range, 'experience-choice');
    label.append(text('strong', range), text('span', 'years'));
    document.getElementById('experience-options').append(label);
  });

  referralSources.forEach((source) => {
    const label = radioChoice('referral', source, 'pill-choice');
    label.append(text('span', source));
    document.getElementById('referral-options').append(label);
  });

  function updateValidation() {
    goalContinue.disabled = !state.goal || (state.goal === 'other' && !state.otherGoal.trim());
    aboutContinue.disabled = !state.role || !state.experience || (state.role === 'Other' && !state.otherRole.trim());
    document.getElementById('goal-hint').textContent = goalContinue.disabled ? 'Choose one goal to continue.' : 'A starting point, not a commitment.';
  }

  function updateRecommendation() {
    const goal = goals.find((item) => item.value === state.goal);
    const slug = goal ? goal.challenge : 'http-server';
    const challenge = challenges[slug];
    const reasons = {
      systems: 'You want to understand the internals. Start with a database you can take apart and rebuild.',
      'new-language': 'You want to learn a new language. Give it a practical first project with requests, responses, and real tests.',
      deepen: 'You want to go deeper in your language. Put it to work on protocols, networking, and persistence.',
      portfolio: 'You want a substantial project. Build a working version of a tool developers use every day.',
      interviews: 'You want stronger systems fundamentals. Work through networking, protocols, and storage in code.',
      explore: 'You came to explore. Start with the tool that launches all the other tools.',
      other: 'Start with a small, working server. You can explore the full challenge catalog at any time.',
    };
    document.getElementById('recommendation-reason').textContent = reasons[state.goal] || reasons.other;
    document.getElementById('challenge-name').textContent = challenge.name;
    document.getElementById('challenge-description').textContent = challenge.description;
    document.getElementById('challenge-logo').src = `${assetRoot}challenge-logos/challenge-logo-${slug}.svg`;
    document.getElementById('first-stage-title').textContent = challenge.firstStage;
    document.getElementById('start-building').href = `https://app.codecrafters.io/courses/${slug}/overview`;
    document.getElementById('challenge-topics').replaceChildren(...challenge.topics.map((topic) => text('span', topic)));
  }

  function showStep(step) {
    state.step = step;
    document.querySelectorAll('.step').forEach((section, index) => {
      section.hidden = index + 1 !== step;
    });
    document.querySelectorAll('[data-journey]').forEach((item) => {
      const itemStep = Number(item.dataset.journey);
      item.classList.toggle('is-complete', itemStep < step);
      if (itemStep === step) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
      const marker = item.querySelector('.journey-marker');
      marker.replaceChildren(itemStep < step ? image('heroicons/outline/check-outline.svg') : document.createTextNode(String(itemStep)));
    });
    document.getElementById('progress-text').textContent = `${step} of 3`;
    document.getElementById('mobile-progress-fill').style.width = `${(step / 3) * 100}%`;
    if (step === 3) updateRecommendation();
    updateValidation();
    const heading = document.querySelector(`#step-${step} h1`);
    heading.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('step-announcement').textContent = `Step ${step} of 3: ${heading.textContent}`;
  }

  form.addEventListener('change', (event) => {
    const { name, value } = event.target;
    if (!(name in state)) return;
    state[name] = value;
    document.getElementById('other-goal-field').hidden = state.goal !== 'other';
    document.getElementById('other-role-field').hidden = state.role !== 'Other';
    document.getElementById('other-referral-field').hidden = state.referral !== 'Other';
    updateValidation();
  });

  form.addEventListener('input', (event) => {
    const { name, value } = event.target;
    if (!(name in state)) return;
    state[name] = value;
    updateValidation();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (state.step === 1 && !goalContinue.disabled) showStep(2);
    else if (state.step === 2 && !aboutContinue.disabled) showStep(3);
  });

  document.querySelectorAll('[data-back]').forEach((button) => {
    button.addEventListener('click', () => showStep(Number(button.dataset.back)));
  });
  document.getElementById('skip-about').addEventListener('click', () => showStep(3));
  document.getElementById('restart-preview').addEventListener('click', () => {
    form.reset();
    Object.keys(state).forEach((key) => {
      state[key] = key === 'step' ? 1 : '';
    });
    document.querySelectorAll('.other-answer').forEach((field) => {
      field.hidden = true;
    });
    document.querySelectorAll('details').forEach((details) => {
      details.open = false;
    });
    showStep(1);
  });
  updateValidation();
})();
