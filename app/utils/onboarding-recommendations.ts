export interface OnboardingPreferences {
  goal: string;
  role: string;
  experience: string;
  companySize: string;
  referralSurveyId: string | null;
}

export const onboardingGoals = [
  {
    value: 'Understand how systems work',
    title: 'Understand how systems work',
    description: 'Get inside the tools you use every day.',
    icon: 'server-outline',
    slugs: ['redis', 'kafka', 'sqlite'],
    reason: 'Explore networking, commands, and persistence in a database you build yourself.',
  },
  {
    value: 'Pick up a new language',
    title: 'Learn a new language',
    description: 'Put new syntax to work on a real project.',
    icon: 'code-outline',
    slugs: ['http-server', 'shell', 'redis'],
    reason: 'Put your new language to work on a focused project with requests, responses, and real tests.',
  },
  {
    value: 'Master a language',
    title: 'Go deeper in my language',
    description: 'Move beyond the basics. Build with confidence.',
    icon: 'cube-transparent-outline',
    slugs: ['redis', 'git', 'sqlite'],
    reason: 'Go deeper in your language by implementing protocols, networking, and persistence.',
  },
  {
    value: 'Build portfolio projects',
    title: 'Build portfolio projects',
    description: 'Create something substantial from scratch.',
    icon: 'briefcase-outline',
    slugs: ['git', 'redis', 'http-server'],
    reason: 'Build a substantial project: your own version of a tool developers use every day.',
  },
  {
    value: 'Interview prep',
    title: 'Prepare for interviews',
    description: 'Practice systems fundamentals by building.',
    icon: 'academic-cap-outline',
    slugs: ['redis', 'kafka', 'http-server'],
    reason: 'Practice networking, protocols, and storage in code to strengthen your systems fundamentals.',
  },
  { value: 'Not sure yet', title: 'Follow my curiosity', description: 'Explore and see what clicks.', icon: 'beaker-outline', slugs: [], reason: '' },
];

const roleSlugs: Record<string, string[]> = {
  Backend: ['kafka', 'redis', 'http-server'],
  'Full-stack': ['redis', 'http-server', 'sqlite'],
  Frontend: ['http-server', 'git', 'redis'],
  'ML or Data': ['sqlite', 'claude-code', 'kafka'],
  Student: ['shell', 'http-server', 'git'],
  'Engineering manager': ['kafka', 'redis', 'sqlite'],
};

export function recommendedCourseSlugs(preferences: OnboardingPreferences | null): string[] {
  if (!preferences) return [];

  const goal = onboardingGoals.find((item) => item.value === preferences.goal);
  let related = roleSlugs[preferences.role] || [];

  if (preferences.role === 'Backend' && ['<2', '2\u20135'].includes(preferences.experience)) related = ['redis', 'http-server', 'kafka'];
  if (!related.length && preferences.experience === '10+') related = ['redis', 'kafka', 'sqlite'];

  return [...new Set([...(goal?.slugs.slice(0, 1) || []), ...related, ...(goal?.slugs.slice(1) || [])])];
}

export function recommendationReason(preferences: OnboardingPreferences | null): string {
  const goal = onboardingGoals.find((item) => item.value === preferences?.goal);
  if (goal?.reason) return goal.reason;

  const reasons: Record<string, string> = {
    Backend: 'Explore the networking and storage behind a backend system.',
    'Full-stack': 'Go beneath the application layer and build the database behind it.',
    Frontend: 'Follow a browser request into the server and build what happens next.',
    'ML or Data': 'Explore how a database reads, organizes, and retrieves the data you work with.',
    Student: 'Start with a tool you can use right away, one small command at a time.',
    'Engineering manager': 'Explore the implementation behind event streaming and system architecture.',
  };

  return reasons[preferences?.role || ''] || 'Explore a real system through small stages, with test feedback as you build.';
}

export const referralSources = [
  'YouTube',
  'GitHub',
  'Google',
  'Reddit',
  'Hacker News',
  'LinkedIn',
  'Twitter',
  'Instagram',
  'Facebook',
  'TikTok',
  'Friend/Colleague',
  'Newsletter',
  'Other',
  "Don't remember",
];
