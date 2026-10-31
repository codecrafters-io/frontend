# Returning-user onboarding

The catalog includes a dismissible profile invitation. It does not change login
redirects or interrupt challenge URLs. Only one catalog prompt appears at a time.

## Frontend behavior

- An active `onboarding-profile-v1` feature suggestion enables the invitation.
- An incomplete onboarding survey offers **Continue setup**, linking to the full
  onboarding flow. It remains optional.
- A completed or absent survey offers a short inline form: role, professional
  programming experience, and optional company size. Existing goals and referral
  answers are not asked again.
- **Not now** persists `dismissedAt` through the existing feature-suggestion PATCH.
- Saving posts `submitted_onboarding_profile` with `schema_version: 1`,
  `source: catalog_profile_prompt`, the suggestion ID, and profile answers. Only
  after that succeeds does the invitation get dismissed.
- Completing or skipping the full invited onboarding also dismisses its profile
  invitation. Failed saves preserve answers and allow retry.

## Backend rollout needed

This checkout implements the frontend only. No new endpoint is assumed.

The backend must issue at most one `onboarding-profile-v1` feature suggestion per
eligible existing user and include it in the current user's `feature-suggestions`
relationship. Do not generate it for new signups, users who already submitted or
skipped profile schema version 1, or users who dismissed the invitation. Preserve
the record and its dismissal across sessions and devices; do not recreate it at
login. Old survey `status: complete` alone does not establish that these new
profile questions have been answered.

Before rollout, verify that the existing feature-suggestion PATCH permits this
slug and that profile analytics are available to the cohort analysis pipeline.
The backend should also resolve the invitation when it receives a successful
profile submission, covering interrupted clients and submissions on other devices.

The frontend does not infer eligibility from account age, missing analytics, or
browser storage. Until the backend issues the suggestion, production users will
not see this prompt.

## Local review

The local mock preview supplies an eligible returning user. Review both completed
and unfinished survey fixtures, dismissal and reload, profile save, and direct
challenge navigation. The preview is not evidence that production eligibility has
been deployed.
