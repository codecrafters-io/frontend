# Returning-user onboarding

The catalog includes a dismissible profile invitation. It does not change login
redirects or interrupt challenge URLs. Only one catalog prompt appears at a time.

## Frontend behavior

- An active `onboarding-profile-v1` feature suggestion enables the invitation.
- An incomplete onboarding survey offers **Continue setup**, linking to the full
  onboarding flow. It remains optional.
- A completed or absent survey offers one optional personalization form: role,
  professional programming experience, and company size. Each answer is optional.
  Existing goals and referral answers are not asked again.
- **I'll pick myself** persists `dismissedAt` through the existing feature-suggestion PATCH.
- Saving posts `submitted_onboarding_profile` with `schema_version: 1`,
  `source: catalog_profile_prompt`, the suggestion ID, and profile answers. Only
  after that succeeds does the invitation get dismissed.
- Completing or skipping the full invited onboarding also dismisses its profile
  invitation. Failed saves preserve answers and allow retry.

## Personalization and storage

- Signup contains two screens: goal, then optional profile. Both can be skipped.
- Completion opens the catalog. Goal and role order relevant, public live
  challenges; experience changes the default visibility of starting guidance.
- Recently active courses retain their position ahead of unstarted challenges.
- Company size is research context and does not influence difficulty or ranking.
- "Your preferences" reopens an editable form without requiring another invitation.
- "How did you hear about us?" is an optional catalog section after signup. It
  updates the existing survey independently and never blocks challenge navigation.
- Profile events use the existing analytics endpoint. Preferences are also cached
  under a user-specific browser key for immediate display and later visits on that
  browser. Signing out or switching accounts does not share personalization.
- Browser storage failures leave the current session usable. Cross-device profile
  preference syncing requires backend profile storage; analytics events alone are
  not a client-readable profile API. No new backend fields or endpoints are assumed.

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
