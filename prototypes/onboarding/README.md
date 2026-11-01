# CodeCrafters personalization prototype

A standalone, static HTML/CSS/JavaScript prototype. It is separate from the
frontend app and makes no API requests, creates no accounts or repositories, and
sends no answers. Refresh or Restart resets the demo.

## Review

- New signup: `/` or `?view=signup` starts with "What brings you here?", then the optional role/experience/company screen.
- Returning user: `?view=returning` starts in the catalog with a dismissible invitation.
- All questions are optional, including individual answers. Clear controls
  remove individual choices. "I'll pick myself" opens the default catalog.
- Goal and profile answers immediately update the sidebar preview, then reorder the catalog.
- "How did you hear about us?" is restored as an optional expandable question after the recommendation. Its answer can be edited without leaving the catalog. Referral never affects recommendations.
- Preferences can be edited from the catalog. All challenges remain available.
- Challenge cards open an in-prototype detail preview. There is no live login or
  setup navigation.

## Recommendation behavior

A specific goal supplies the first recommendation; role orders related challenges next. Skipped, curiosity, and custom goals let the role/experience rules supply the suggestion. All original goal choices and custom text are available.

Role orders challenges using a small, explicit lookup. Backend places Kafka first;
with fewer than five years of professional experience it suggests Redis first.
ML or Data places SQLite first, followed by Claude Code and Kafka. Frontend starts
with HTTP server; full-stack with Redis; students with Shell; managers with Kafka.
Other or unanswered role uses the default order, except 10+ years suggests Redis.

Experience changes the starting guidance: under five years sees an expanded
introduction; five or more sees a concise, collapsed version. Guidance remains
available to everyone. Professional experience uses the exact cohort bins:
`<2`, `2-5`, `5-10`, `10+` (the UI uses en dashes).

Company size is optional research context. It deliberately does not change
challenge difficulty or suggest engineering ability. The form explains its purpose.
Goal, role, and experience appear in the catalog preference summary.

The catalog contains seven representative, existing CodeCrafters challenges.
Challenge availability was checked against https://codecrafters.io/; this is not
a complete replica of the live catalog. Recommendations are prototype rules,
not claims about popularity, user cohorts, or validated suitability.

## Returning-user implementation boundary

The invitation is shown once per demo run and remains dismissed while navigating
inside the prototype. Reloading or Restart resets it. Real once-at-login targeting
would require server-backed profile eligibility and dismissal/completion state;
this prototype does not implement authentication or cross-session persistence.

## Run or share

Run `python3 -m http.server 4302` from the frontend repository root, then open
`http://127.0.0.1:4302/prototypes/onboarding/`. This copy reuses the repository's
`public/assets/images/` assets. The hosted standalone version bundles those assets
separately at https://codecrafters-onboarding-prototype.vercel.app/.

The actual Ember implementation uses the existing survey API for goals/referral
and analytics API for profile answers. Browser preferences provide immediate
catalog personalization; see [integration notes](returning-user-integration.md).
