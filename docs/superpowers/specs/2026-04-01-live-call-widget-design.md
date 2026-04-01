# Live Call Widget — Design Spec

## Overview

A floating widget that allows staff members to host live video calls with users directly from the CodeCrafters app. When a staff member activates the widget, eligible users see a floating card in the bottom-right corner of all authenticated pages. Clicking it opens a pre-configured Google Meet link in a new tab.

## Goals

- Learn why users come to CodeCrafters by talking to them directly
- Provide a frictionless way for users to join a live call
- Keep targeting logic (who sees the widget) fully opaque to end users
- Make the widget configurable so any staff member can host

## Architecture: Backend-Controlled, Feature-Flag-Driven

All eligibility logic lives server-side. The frontend receives a single boolean signal (`live_call_widget_available`) plus display data. No targeting details are ever exposed to the client.

---

## Backend (Core Rails App)

### New Table: `live_call_widget_configs`

Single-row configuration table.

| Column            | Type    | Default | Description                                      |
|-------------------|---------|---------|--------------------------------------------------|
| `id`              | PK      | —       | Primary key                                      |
| `is_active`       | boolean | false   | Whether the widget is currently live              |
| `meet_link`       | string  | null    | Google Meet URL                                   |
| `host_name`       | string  | null    | Display name of the host (e.g., "Sarup Banskota") |
| `host_title`      | string  | null    | Host's role (e.g., "CEO, CodeCrafters")           |
| `avatar_url`      | string  | null    | URL to host's avatar image                        |
| `cta_text`        | string  | null    | CTA copy shown on the card                        |
| `button_text`     | string  | null    | Text on the call-to-action button                 |
| `audience_filter`  | string  | "all"   | Enum: `all`, `paid_only`, `free_only`             |
| `geo_filter`       | string  | "all"   | Enum: `all`, `us_only`                            |
| `updated_at`      | datetime| —       | Last modification timestamp                       |

### API Endpoints

All endpoints are staff/admin-only.

**`GET /api/v1/live-call-widget-config`**
- Returns the current config (all fields)
- Used by the admin panel in the frontend

**`PATCH /api/v1/live-call-widget-config`**
- Updates any config fields (partial update)
- When `is_active` changes, triggers an ActionCable broadcast on `LiveCallWidgetChannel`
- Payload: JSON:API formatted attributes

**`POST /api/v1/live-call-widget-config/mark-user-spoken`**
- Accepts `{ username: "some_user" }`
- Sets `live_call_eligible: "false"` in the target user's `feature_flags` JSONB column
- Returns success/failure

### User Eligibility (Serializer)

Added to the existing `UserSerializer` as virtual attributes:

- **`live_call_widget_available`** (boolean): Evaluated per-request. True when ALL of:
  - `live_call_widget_configs.is_active` is true
  - User matches `audience_filter` (paid/free/all based on subscription status)
  - User matches `geo_filter` (IP address checked server-side from request headers)
  - User's `feature_flags["live_call_eligible"]` is not `"false"`

- **`live_call_widget_display_data`** (JSON object serialized as a JSON:API attribute, only included when `live_call_widget_available` is true):
  - `host_name`, `host_title`, `avatar_url`, `cta_text`, `button_text`, `meet_link`
  - Serialized as a single JSON:API attribute (like the existing `feature_flags` JSONB attribute pattern) — not a separate relationship

### ActionCable Channel: `LiveCallWidgetChannel`

- All authenticated users subscribe on app boot
- Broadcasts when `is_active` is toggled:
  - Toggle on: `{ type: "status_change", available: true }`
  - Toggle off: `{ type: "status_change", available: false }`
- Broadcast is a "something changed" signal only — no eligibility or targeting data included
- On receiving `available: true`, the frontend re-fetches the current user to get `live_call_widget_available` and display data (eligibility evaluated server-side at that point)
- On receiving `available: false`, the frontend hides the widget immediately without a fetch

---

## Frontend (Ember.js App)

### User-Facing Widget Component

**Location:** Bottom-right corner of all authenticated pages, same position as HelpScout beacon.

**Appearance:** Compact floating card (dark-themed to match app), containing:
- Host avatar (circular)
- Host name + "Live now" indicator (green dot)
- CTA text
- Call-to-action button

**Styling:** Uses the app's existing Tailwind classes, CSS custom properties, border radius, and color scheme. Supports dark/light mode. Looks native to the app, not like a third-party widget.

**Behavior:**
- Rendered when `live_call_widget_available` is true on the current user model
- Entrance animation (fade/slide in) when appearing
- Clicking the button calls `window.open(meetLink, '_blank')` to open Meet in a new tab
- No server call on click — staff toggles off manually

**HelpScout Integration:**
- When the live call widget is visible, the existing beacon service hides HelpScout
- When the live call widget hides, HelpScout restores to its normal route-based visibility

### Admin Panel Component

**Visibility:** Shown instead of the user-facing widget for staff/admin users. Same bottom-right position.

**Layout:**
- Collapsed state: small icon/indicator showing active/inactive status
- Expanded state: full configuration panel

**Expanded panel sections:**

**Configuration:**
- Host name (text input)
- Host title (text input)
- Avatar URL (text input, defaults to current user's app avatar)
- CTA text (text input)
- Button text (text input)
- Meet link (text input)
- Audience filter (dropdown: All / Paid only / Free only)
- Geo filter (dropdown: All / US only)
- Save button

**Controls:**
- On/off toggle (prominent, at the top)
- "Mark as spoken to" — username text input + submit button
- Status line reflecting current filters (e.g., "Active for: Paid users, US only")

**Behavior:**
- Config changes save via `PATCH /api/v1/live-call-widget-config`
- Toggling on/off triggers the ActionCable broadcast in real-time
- Staff users never see the user-facing widget

### Real-Time Service

**ActionCable subscription:** `LiveCallWidgetChannel`
- Subscribed on app boot for all authenticated users
- On `{ available: true }`: triggers a re-fetch of the current user to evaluate eligibility server-side; if eligible, widget appears with display data
- On `{ available: false }`: hides widget immediately, no fetch needed

### Feature Flag

**`live_call_eligible`** in the user's `feature_flags` JSONB:
- Not set or any truthy value: user is eligible (default state)
- Set to `"false"`: user has been spoken to and is permanently ineligible
- Evaluated server-side only — frontend never reads this flag directly

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Multiple staff toggle at once | Single-row table, last write wins. Acceptable for low-frequency operation. |
| User becomes eligible mid-session (e.g., subscribes) | Picks up widget on next page load or next ActionCable broadcast. |
| Staff closes browser while widget is active | Widget stays on until someone toggles it off. |
| User opens Meet after staff toggled off (race condition) | User lands in empty Meet room. Rare, acceptable. |
| User marked as spoken-to while widget is visible to them | Widget persists until next status change or page load. Staff is about to toggle off anyway. |

---

## Not in V1

- Call analytics or history tracking
- Queue system for multiple users trying to join
- Auto-timeout for active state
- Notification to staff when someone joins Meet
- Mobile app support (browser only)

---

## Naming Reference

| Concept | Name |
|---------|------|
| DB table | `live_call_widget_configs` |
| API endpoints | `/api/v1/live-call-widget-config` |
| ActionCable channel | `LiveCallWidgetChannel` |
| Feature flag | `live_call_eligible` |
| User serializer attribute | `live_call_widget_available` |
| User serializer attribute | `live_call_widget_display_data` |
