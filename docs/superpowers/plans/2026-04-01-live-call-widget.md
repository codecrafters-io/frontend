# Live Call Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a live call widget that lets staff host video calls with users, with real-time availability toggling and audience targeting.

**Architecture:** Backend-controlled eligibility via a singleton config table + feature flags. ActionCable broadcasts availability changes. Frontend renders a floating widget for eligible users and an admin panel for staff.

**Tech Stack:** Rails 8.1 (core), Ember.js 6.4 with TypeScript (frontend), ActionCable for real-time, Tailwind CSS, JSON:API

**Spec:** `docs/superpowers/specs/2026-04-01-live-call-widget-design.md`

---

## File Structure

### Core (`/Users/sarupbanskota/gig/cc/work/core`)

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `db/migrate/YYYYMMDDHHMMSS_create_live_call_widget_configs.rb` | Migration |
| Create | `app/models/live_call_widget_config.rb` | Model + eligibility logic |
| Create | `app/serializers/live_call_widget_config_serializer.rb` | JSON:API serializer for admin API |
| Create | `app/controllers/api/live_call_widget_configs_controller.rb` | Admin CRUD + mark-user-spoken |
| Create | `app/channels/live_call_widget_channel.rb` | ActionCable broadcast channel |
| Modify | `app/models/request.rb` | Add `cf-ipcountry` to whitelisted headers |
| Modify | `app/serializers/user_serializer.rb` | Add `live_call_widget_available` + `live_call_widget_display_data` attributes |
| Modify | `config/routes.rb` | Add config resource routes |
| Create | `test/controllers/api/live_call_widget_configs_controller_test.rb` | Controller tests |
| Create | `test/models/live_call_widget_config_test.rb` | Model tests |
| Create | `test/factories/live_call_widget_config.rb` | Factory |

### Frontend (`/Users/sarupbanskota/gig/cc/work/frontend`)

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `app/models/user.ts` | Add `liveCallWidgetAvailable` + `liveCallWidgetDisplayData` attributes |
| Create | `app/services/live-call-widget.ts` | State management, ActionCable subscription, admin API calls |
| Create | `app/components/live-call-widget/index.hbs` | User-facing floating card template |
| Create | `app/components/live-call-widget/index.ts` | User-facing floating card logic |
| Create | `app/components/live-call-widget-admin/index.hbs` | Admin panel template |
| Create | `app/components/live-call-widget-admin/index.ts` | Admin panel logic |
| Modify | `app/templates/application.hbs` | Render widget components |
| Modify | `app/services/beacon.ts` | Hide HelpScout when live call widget is visible |

---

## Phase 1: Core Backend

### Task 1: Migration + Model + Factory

**Files:**
- Create: `db/migrate/20260401120000_create_live_call_widget_configs.rb`
- Create: `app/models/live_call_widget_config.rb`
- Create: `test/factories/live_call_widget_config.rb`

**Working directory:** `/Users/sarupbanskota/gig/cc/work/core`

- [ ] **Step 1: Write the migration**

```ruby
# db/migrate/20260401120000_create_live_call_widget_configs.rb
class CreateLiveCallWidgetConfigs < ActiveRecord::Migration[8.1]
  def change
    create_table :live_call_widget_configs, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.boolean :is_active, default: false, null: false
      t.string :meet_link
      t.string :host_name
      t.string :host_title
      t.string :avatar_url
      t.string :cta_text
      t.string :button_text
      t.string :audience_filter, default: "all", null: false
      t.string :geo_filter, default: "all", null: false
      t.timestamps
    end
  end
end
```

- [ ] **Step 2: Run the migration**

Run: `bin/rails db:migrate`
Expected: Migration succeeds, `live_call_widget_configs` table created.

- [ ] **Step 3: Write the model**

```ruby
# app/models/live_call_widget_config.rb
class LiveCallWidgetConfig < ApplicationRecord
  AUDIENCE_FILTERS = %w[all paid_only free_only].freeze
  GEO_FILTERS = %w[all us_only].freeze

  validates :audience_filter, inclusion: {in: AUDIENCE_FILTERS}
  validates :geo_filter, inclusion: {in: GEO_FILTERS}

  def self.current
    first_or_create!(
      host_name: "CodeCrafters Team",
      host_title: "CodeCrafters",
      cta_text: "Chat with us — we'd love to hear what you're building!",
      button_text: "Join Video Call"
    )
  end

  def user_eligible?(user, country_code: nil)
    return false unless is_active
    return false if user.feature_flags["live_call_eligible"] == "false"

    case audience_filter
    when "paid_only"
      return false unless user.can_access_membership_benefits?
    when "free_only"
      return false if user.can_access_membership_benefits?
    end

    if geo_filter == "us_only"
      return false unless country_code&.upcase == "US"
    end

    true
  end

  def display_data
    {
      host_name: host_name,
      host_title: host_title,
      avatar_url: avatar_url,
      cta_text: cta_text,
      button_text: button_text,
      meet_link: meet_link
    }
  end
end
```

- [ ] **Step 4: Write the factory**

```ruby
# test/factories/live_call_widget_config.rb
FactoryBot.define do
  factory :live_call_widget_config do
    is_active { false }
    meet_link { "https://meet.google.com/abc-defg-hij" }
    host_name { "Test Host" }
    host_title { "CEO, CodeCrafters" }
    avatar_url { "https://example.com/avatar.png" }
    cta_text { "Chat with us!" }
    button_text { "Join Video Call" }
    audience_filter { "all" }
    geo_filter { "all" }
  end
end
```

- [ ] **Step 5: Commit**

```bash
git add db/migrate/20260401120000_create_live_call_widget_configs.rb app/models/live_call_widget_config.rb test/factories/live_call_widget_config.rb db/schema.rb db/schema_cache.yml
git commit -m "feat: add live_call_widget_configs table and model"
```

---

### Task 2: Model Tests

**Files:**
- Create: `test/models/live_call_widget_config_test.rb`

**Working directory:** `/Users/sarupbanskota/gig/cc/work/core`

- [ ] **Step 1: Write the model tests**

```ruby
# test/models/live_call_widget_config_test.rb
require "test_helper"

class LiveCallWidgetConfigTest < ActiveSupport::TestCase
  test "current creates a default config if none exists" do
    assert_difference "LiveCallWidgetConfig.count", 1 do
      config = LiveCallWidgetConfig.current
      assert_equal false, config.is_active
      assert_equal "all", config.audience_filter
      assert_equal "all", config.geo_filter
    end
  end

  test "current returns existing config" do
    existing = create(:live_call_widget_config)
    assert_equal existing, LiveCallWidgetConfig.current
  end

  test "validates audience_filter inclusion" do
    config = build(:live_call_widget_config, audience_filter: "invalid")
    assert_not config.valid?
  end

  test "validates geo_filter inclusion" do
    config = build(:live_call_widget_config, geo_filter: "invalid")
    assert_not config.valid?
  end

  test "user_eligible? returns false when inactive" do
    config = build(:live_call_widget_config, is_active: false)
    user = create(:user)
    assert_not config.user_eligible?(user)
  end

  test "user_eligible? returns true when active and no filters" do
    config = build(:live_call_widget_config, is_active: true, audience_filter: "all", geo_filter: "all")
    user = create(:user)
    assert config.user_eligible?(user)
  end

  test "user_eligible? returns false when user has live_call_eligible set to false" do
    config = build(:live_call_widget_config, is_active: true)
    user = create(:user)
    user.update!(feature_flags: {"live_call_eligible" => "false"})
    assert_not config.user_eligible?(user)
  end

  test "user_eligible? filters by paid_only" do
    config = build(:live_call_widget_config, is_active: true, audience_filter: "paid_only")
    user = create(:user)
    assert_not config.user_eligible?(user)
  end

  test "user_eligible? filters by us_only" do
    config = build(:live_call_widget_config, is_active: true, geo_filter: "us_only")
    user = create(:user)
    assert_not config.user_eligible?(user, country_code: "DE")
    assert config.user_eligible?(user, country_code: "US")
  end

  test "display_data returns config fields" do
    config = build(:live_call_widget_config, host_name: "Sarup", meet_link: "https://meet.google.com/test")
    data = config.display_data
    assert_equal "Sarup", data[:host_name]
    assert_equal "https://meet.google.com/test", data[:meet_link]
  end
end
```

- [ ] **Step 2: Run the tests**

Run: `bin/rails test test/models/live_call_widget_config_test.rb`
Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add test/models/live_call_widget_config_test.rb
git commit -m "test: add live_call_widget_config model tests"
```

---

### Task 3: Config Serializer

**Files:**
- Create: `app/serializers/live_call_widget_config_serializer.rb`

**Working directory:** `/Users/sarupbanskota/gig/cc/work/core`

- [ ] **Step 1: Write the serializer**

```ruby
# app/serializers/live_call_widget_config_serializer.rb
class LiveCallWidgetConfigSerializer < ApplicationSerializer
  attribute :is_active
  attribute :meet_link
  attribute :host_name
  attribute :host_title
  attribute :avatar_url
  attribute :cta_text
  attribute :button_text
  attribute :audience_filter
  attribute :geo_filter
end
```

- [ ] **Step 2: Commit**

```bash
git add app/serializers/live_call_widget_config_serializer.rb
git commit -m "feat: add live_call_widget_config serializer"
```

---

### Task 4: Controller + Routes

**Files:**
- Create: `app/controllers/api/live_call_widget_configs_controller.rb`
- Modify: `config/routes.rb`
- Create: `test/controllers/api/live_call_widget_configs_controller_test.rb`

**Working directory:** `/Users/sarupbanskota/gig/cc/work/core`

- [ ] **Step 1: Write the controller test**

```ruby
# test/controllers/api/live_call_widget_configs_controller_test.rb
require "test_helper"

class API::LiveCallWidgetConfigsControllerTest < ActionDispatch::IntegrationTest
  # === GET /api/v1/live-call-widget-config ===

  test "show requires authentication" do
    get "/api/v1/live-call-widget-config"
    assert_response :unauthorized
  end

  test "show requires staff" do
    user = create(:user)
    login(user)
    get "/api/v1/live-call-widget-config"
    assert_response :forbidden
  end

  test "show returns current config for staff" do
    config = create(:live_call_widget_config, host_name: "Sarup")
    user = create(:user, username: "rohitpaulk")
    login(user)
    get "/api/v1/live-call-widget-config"
    assert_response :success
    parsed = JSON.parse(response.body)
    assert_equal "Sarup", parsed.dig("data", "attributes", "host-name")
  end

  # === PATCH /api/v1/live-call-widget-config ===

  test "update requires staff" do
    create(:live_call_widget_config)
    user = create(:user)
    login(user)
    patch "/api/v1/live-call-widget-config", params: {data: {attributes: {"is-active": true}}}
    assert_response :forbidden
  end

  test "update changes config attributes" do
    config = create(:live_call_widget_config, is_active: false, host_name: "Old")
    user = create(:user, username: "rohitpaulk")
    login(user)

    assert_changes -> { config.reload.is_active }, from: false, to: true do
      patch "/api/v1/live-call-widget-config", params: {data: {attributes: {"is-active": true, "host-name": "New"}}}
      assert_response :success
    end

    assert_equal "New", config.reload.host_name
  end

  test "update broadcasts via ActionCable when is_active changes" do
    config = create(:live_call_widget_config, is_active: false)
    user = create(:user, username: "rohitpaulk")
    login(user)

    assert_broadcasts("live_call_widget", 1) do
      patch "/api/v1/live-call-widget-config", params: {data: {attributes: {"is-active": true}}}
      assert_response :success
    end
  end

  test "update does not broadcast when is_active does not change" do
    config = create(:live_call_widget_config, is_active: true)
    user = create(:user, username: "rohitpaulk")
    login(user)

    assert_no_broadcasts("live_call_widget") do
      patch "/api/v1/live-call-widget-config", params: {data: {attributes: {"host-name": "Updated"}}}
      assert_response :success
    end
  end

  # === POST /api/v1/live-call-widget-config/mark-user-spoken ===

  test "mark_user_spoken requires staff" do
    user = create(:user)
    login(user)
    post "/api/v1/live-call-widget-config/mark-user-spoken", params: {username: "someone"}
    assert_response :forbidden
  end

  test "mark_user_spoken sets live_call_eligible to false" do
    target = create(:user, username: "targetuser")
    staff = create(:user, username: "rohitpaulk")
    login(staff)

    assert_changes -> { target.reload.feature_flags["live_call_eligible"] }, from: nil, to: "false" do
      post "/api/v1/live-call-widget-config/mark-user-spoken", params: {username: "targetuser"}
      assert_response :success
    end
  end

  test "mark_user_spoken returns 404 for unknown user" do
    staff = create(:user, username: "rohitpaulk")
    login(staff)

    post "/api/v1/live-call-widget-config/mark-user-spoken", params: {username: "nonexistent"}
    assert_response :not_found
  end
end
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bin/rails test test/controllers/api/live_call_widget_configs_controller_test.rb`
Expected: FAIL — controller and routes don't exist yet.

- [ ] **Step 3: Add routes**

In `config/routes.rb`, inside the `namespace :api, path: "api/v1"` block, add:

```ruby
resource :live_call_widget_config, path: "live-call-widget-config", only: [:show, :update] do
  post :mark_user_spoken, path: "mark-user-spoken"
end
```

Note: `resource` (singular) since it's a singleton — no `:id` in URL.

- [ ] **Step 4: Write the controller**

```ruby
# app/controllers/api/live_call_widget_configs_controller.rb
class API::LiveCallWidgetConfigsController < APIController
  before_action :authenticate_staff!

  def show
    config = LiveCallWidgetConfig.current
    render_jsonapi_response(LiveCallWidgetConfigSerializer, config)
  end

  def update
    config = LiveCallWidgetConfig.current

    config.with_lock do
      config.is_active = params.dig(:data, :attributes, "is-active") unless params.dig(:data, :attributes, "is-active").nil?
      config.meet_link = params.dig(:data, :attributes, "meet-link") if params.dig(:data, :attributes, "meet-link")
      config.host_name = params.dig(:data, :attributes, "host-name") if params.dig(:data, :attributes, "host-name")
      config.host_title = params.dig(:data, :attributes, "host-title") if params.dig(:data, :attributes, "host-title")
      config.avatar_url = params.dig(:data, :attributes, "avatar-url") if params.dig(:data, :attributes, "avatar-url")
      config.cta_text = params.dig(:data, :attributes, "cta-text") if params.dig(:data, :attributes, "cta-text")
      config.button_text = params.dig(:data, :attributes, "button-text") if params.dig(:data, :attributes, "button-text")
      config.audience_filter = params.dig(:data, :attributes, "audience-filter") if params.dig(:data, :attributes, "audience-filter")
      config.geo_filter = params.dig(:data, :attributes, "geo-filter") if params.dig(:data, :attributes, "geo-filter")

      was_active = config.is_active_was

      config.save!

      if config.saved_change_to_is_active?
        LiveCallWidgetChannel.broadcast!(config.is_active)
      end
    end

    render_jsonapi_response(LiveCallWidgetConfigSerializer, config)
  end

  def mark_user_spoken
    user = User.find_by("lower(username) = ?", params[:username]&.downcase)

    unless user
      render json: {error: "User not found"}, status: :not_found
      return
    end

    user.feature_flags["live_call_eligible"] = "false"
    user.save!

    render json: {data: {username: user.username, marked: true}}, status: :ok
  end
end
```

- [ ] **Step 5: Run tests**

Run: `bin/rails test test/controllers/api/live_call_widget_configs_controller_test.rb`
Expected: Some tests pass, ActionCable broadcast tests may fail (channel not yet created). That's expected — we'll create the channel in the next task.

- [ ] **Step 6: Commit**

```bash
git add app/controllers/api/live_call_widget_configs_controller.rb config/routes.rb test/controllers/api/live_call_widget_configs_controller_test.rb
git commit -m "feat: add live_call_widget_config controller and routes"
```

---

### Task 5: ActionCable Channel

**Files:**
- Create: `app/channels/live_call_widget_channel.rb`

**Working directory:** `/Users/sarupbanskota/gig/cc/work/core`

- [ ] **Step 1: Write the channel**

```ruby
# app/channels/live_call_widget_channel.rb
class LiveCallWidgetChannel < ApplicationCable::Channel
  def subscribed
    EventLogger.info("action_cable.subscribed", channel: self.class.name)
    stream_from "live_call_widget"
  end

  def self.broadcast!(is_active)
    EventLogger.info("action_cable.broadcast", channel: name, is_active: is_active)
    ActionCable.server.broadcast("live_call_widget", {type: "status_change", available: is_active})
  end
end
```

- [ ] **Step 2: Run all controller tests again**

Run: `bin/rails test test/controllers/api/live_call_widget_configs_controller_test.rb`
Expected: All tests pass, including the broadcast assertions.

- [ ] **Step 3: Commit**

```bash
git add app/channels/live_call_widget_channel.rb
git commit -m "feat: add LiveCallWidgetChannel for real-time broadcasts"
```

---

### Task 6: Request Model + User Serializer Eligibility

**Files:**
- Modify: `app/models/request.rb` — add `cf-ipcountry` to `WHITELISTED_HEADERS`
- Modify: `app/serializers/user_serializer.rb` — add `live_call_widget_available` and `live_call_widget_display_data`

**Working directory:** `/Users/sarupbanskota/gig/cc/work/core`

- [ ] **Step 1: Add `cf-ipcountry` to Request whitelisted headers**

In `app/models/request.rb`, add `"cf-ipcountry"` to the `WHITELISTED_HEADERS` array:

```ruby
WHITELISTED_HEADERS = [
  "cf-ipcountry",
  "referrer",
  "user-agent",
  # ... rest unchanged
].freeze
```

Also add a convenience method:

```ruby
def country_code
  headers["cf-ipcountry"]
end
```

- [ ] **Step 2: Add eligibility attributes to UserSerializer**

In `app/serializers/user_serializer.rb`, add these two attributes:

```ruby
attribute :live_call_widget_available do |user|
  config = LiveCallWidgetConfig.current
  config.user_eligible?(user, country_code: Current.request&.country_code)
end

attribute :live_call_widget_display_data do |user|
  config = LiveCallWidgetConfig.current
  if config.user_eligible?(user, country_code: Current.request&.country_code)
    config.display_data
  end
end
```

- [ ] **Step 3: Run existing user controller tests to make sure nothing breaks**

Run: `bin/rails test test/controllers/api/users_controller/`
Expected: All existing tests still pass.

- [ ] **Step 4: Commit**

```bash
git add app/models/request.rb app/serializers/user_serializer.rb
git commit -m "feat: add live_call_widget eligibility to user serializer"
```

---

## Phase 2: Frontend

### Task 7: User Model Attributes

**Files:**
- Modify: `app/models/user.ts`

**Working directory:** `/Users/sarupbanskota/gig/cc/work/frontend`

- [ ] **Step 1: Add new attributes to the User model**

In `app/models/user.ts`, add these attribute declarations alongside the existing ones:

```typescript
@attr('boolean') declare liveCallWidgetAvailable: boolean;
@attr() declare liveCallWidgetDisplayData: {
  host_name: string;
  host_title: string;
  avatar_url: string;
  cta_text: string;
  button_text: string;
  meet_link: string;
} | null;
```

- [ ] **Step 2: Commit**

```bash
git add app/models/user.ts
git commit -m "feat: add live call widget attributes to user model"
```

---

### Task 8: Live Call Widget Service

**Files:**
- Create: `app/services/live-call-widget.ts`

**Working directory:** `/Users/sarupbanskota/gig/cc/work/frontend`

- [ ] **Step 1: Write the service**

```typescript
// app/services/live-call-widget.ts
import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import config from 'codecrafters-frontend/config/environment';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type ActionCableConsumerService from 'codecrafters-frontend/services/action-cable-consumer';
import type { ActionCableSubscription } from 'codecrafters-frontend/services/action-cable-consumer';
import type SessionTokenStorageService from 'codecrafters-frontend/services/session-token-storage';

export default class LiveCallWidgetService extends Service {
  @service declare authenticator: AuthenticatorService;
  @service declare actionCableConsumer: ActionCableConsumerService;
  @service declare sessionTokenStorage: SessionTokenStorageService;

  @tracked isAvailable = false;
  @tracked displayData: {
    host_name: string;
    host_title: string;
    avatar_url: string;
    cta_text: string;
    button_text: string;
    meet_link: string;
  } | null = null;

  subscription: ActionCableSubscription | null = null;

  get shouldShowWidget(): boolean {
    if (!this.authenticator.isAuthenticated) return false;
    if (!this.authenticator.currentUser) return false;
    if (this.authenticator.currentUser.isStaff) return false;

    return this.isAvailable && this.displayData !== null;
  }

  get shouldShowAdminPanel(): boolean {
    if (!this.authenticator.isAuthenticated) return false;
    if (!this.authenticator.currentUser) return false;

    return this.authenticator.currentUser.isStaff;
  }

  subscribe(): void {
    if (this.subscription) return;

    this.subscription = this.actionCableConsumer.subscribe(
      'LiveCallWidgetChannel',
      {},
      {
        onData: (data: { type: string; available: boolean }) => {
          if (data.type === 'status_change') {
            if (data.available) {
              this.refreshUserEligibility();
            } else {
              this.isAvailable = false;
              this.displayData = null;
            }
          }
        },
      },
    );
  }

  unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  syncFromUser(): void {
    const user = this.authenticator.currentUser;
    if (!user) return;

    this.isAvailable = user.liveCallWidgetAvailable ?? false;
    this.displayData = user.liveCallWidgetDisplayData ?? null;
  }

  async refreshUserEligibility(): Promise<void> {
    await this.authenticator.syncCurrentUser();
    this.syncFromUser();
  }

  // --- Admin API methods ---

  async fetchConfig(): Promise<Record<string, unknown>> {
    const response = await fetch(`${config.x.backendUrl}/api/v1/live-call-widget-config`, {
      headers: this.adminHeaders(),
    });

    const json = await response.json();
    return json.data?.attributes ?? {};
  }

  async updateConfig(attributes: Record<string, unknown>): Promise<void> {
    const response = await fetch(`${config.x.backendUrl}/api/v1/live-call-widget-config`, {
      method: 'PATCH',
      headers: {
        ...this.adminHeaders(),
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: { attributes },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update config: ${response.status}`);
    }
  }

  async markUserSpoken(username: string): Promise<{ success: boolean; error?: string }> {
    const response = await fetch(`${config.x.backendUrl}/api/v1/live-call-widget-config/mark-user-spoken`, {
      method: 'POST',
      headers: {
        ...this.adminHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      return { success: true };
    } else if (response.status === 404) {
      return { success: false, error: 'User not found' };
    } else {
      return { success: false, error: 'Something went wrong' };
    }
  }

  private adminHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    const token = this.sessionTokenStorage.currentToken;

    if (token) {
      headers['x-session-token'] = token;
    }

    return headers;
  }
}

declare module '@ember/service' {
  interface Registry {
    'live-call-widget': LiveCallWidgetService;
  }
}
```

- [ ] **Step 2: Verify the service compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors related to the new service file.

- [ ] **Step 3: Commit**

```bash
git add app/services/live-call-widget.ts
git commit -m "feat: add live call widget service with ActionCable and admin API"
```

---

### Task 9: User-Facing Widget Component

**Files:**
- Create: `app/components/live-call-widget/index.hbs`
- Create: `app/components/live-call-widget/index.ts`

**Working directory:** `/Users/sarupbanskota/gig/cc/work/frontend`

- [ ] **Step 1: Write the component TypeScript**

```typescript
// app/components/live-call-widget/index.ts
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import type LiveCallWidgetService from 'codecrafters-frontend/services/live-call-widget';

export default class LiveCallWidgetComponent extends Component {
  @service declare liveCallWidget: LiveCallWidgetService;

  get hostInitial(): string {
    return this.liveCallWidget.displayData?.host_name?.charAt(0)?.toUpperCase() ?? '?';
  }

  @action
  openMeetLink(): void {
    const meetLink = this.liveCallWidget.displayData?.meet_link;

    if (meetLink) {
      window.open(meetLink, '_blank');
    }
  }
}
```

- [ ] **Step 2: Write the component template**

Note: Use the app's actual Tailwind design tokens. The card should match the dark theme of the app with existing border radius, color palette, and spacing. Inspect existing components for exact class patterns.

```handlebars
{{! app/components/live-call-widget/index.hbs }}
{{#if this.liveCallWidget.shouldShowWidget}}
  <div
    class="fixed bottom-6 right-6 z-50 animate-fade-in"
    data-test-live-call-widget
  >
    <div class="w-72 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-gray-925">
      <div class="p-4">
        <div class="flex items-center gap-3 mb-3">
          {{#if this.liveCallWidget.displayData.avatar_url}}
            <img
              src={{this.liveCallWidget.displayData.avatar_url}}
              alt={{this.liveCallWidget.displayData.host_name}}
              class="h-10 w-10 rounded-full object-cover"
            />
          {{else}}
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-sm font-semibold text-white">
              {{this.hostInitial}}
            </div>
          {{/if}}
          <div class="min-w-0">
            <div class="text-sm font-medium text-gray-950 dark:text-gray-100 truncate">
              {{this.liveCallWidget.displayData.host_name}}
            </div>
            <div class="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
              <span class="inline-block h-1.5 w-1.5 rounded-full bg-green-500"></span>
              Live now
            </div>
          </div>
        </div>
        <p class="mb-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
          {{this.liveCallWidget.displayData.cta_text}}
        </p>
        <button
          type="button"
          class="w-full rounded-md bg-teal-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600"
          {{on "click" this.openMeetLink}}
          data-test-live-call-widget-join-button
        >
          {{this.liveCallWidget.displayData.button_text}}
        </button>
      </div>
    </div>
  </div>
{{/if}}
```

- [ ] **Step 3: Commit**

```bash
git add app/components/live-call-widget/
git commit -m "feat: add user-facing live call widget component"
```

---

### Task 10: Admin Panel Component

**Files:**
- Create: `app/components/live-call-widget-admin/index.hbs`
- Create: `app/components/live-call-widget-admin/index.ts`

**Working directory:** `/Users/sarupbanskota/gig/cc/work/frontend`

- [ ] **Step 1: Write the component TypeScript**

```typescript
// app/components/live-call-widget-admin/index.ts
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type LiveCallWidgetService from 'codecrafters-frontend/services/live-call-widget';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export default class LiveCallWidgetAdminComponent extends Component {
  @service declare liveCallWidget: LiveCallWidgetService;
  @service declare authenticator: AuthenticatorService;

  @tracked isExpanded = false;
  @tracked isLoading = false;
  @tracked isSaving = false;
  @tracked markSpokenUsername = '';
  @tracked markSpokenStatus = '';

  // Config form state
  @tracked isActive = false;
  @tracked meetLink = '';
  @tracked hostName = '';
  @tracked hostTitle = '';
  @tracked avatarUrl = '';
  @tracked ctaText = '';
  @tracked buttonText = '';
  @tracked audienceFilter = 'all';
  @tracked geoFilter = 'all';

  get isAudienceAll(): boolean { return this.audienceFilter === 'all'; }
  get isAudiencePaid(): boolean { return this.audienceFilter === 'paid_only'; }
  get isAudienceFree(): boolean { return this.audienceFilter === 'free_only'; }
  get isGeoAll(): boolean { return this.geoFilter === 'all'; }
  get isGeoUs(): boolean { return this.geoFilter === 'us_only'; }

  @action
  async toggleExpanded(): Promise<void> {
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded && !this.isLoading) {
      await this.loadConfig();
    }
  }

  @action
  async loadConfig(): Promise<void> {
    this.isLoading = true;

    try {
      const attrs = await this.liveCallWidget.fetchConfig() as Record<string, string | boolean>;
      this.isActive = attrs['is-active'] as boolean ?? false;
      this.meetLink = (attrs['meet-link'] as string) ?? '';
      this.hostName = (attrs['host-name'] as string) ?? '';
      this.hostTitle = (attrs['host-title'] as string) ?? '';
      this.avatarUrl = (attrs['avatar-url'] as string) ?? '';
      this.ctaText = (attrs['cta-text'] as string) ?? '';
      this.buttonText = (attrs['button-text'] as string) ?? '';
      this.audienceFilter = (attrs['audience-filter'] as string) ?? 'all';
      this.geoFilter = (attrs['geo-filter'] as string) ?? 'all';
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async toggleActive(): Promise<void> {
    const newValue = !this.isActive;
    this.isActive = newValue;

    await this.liveCallWidget.updateConfig({ 'is-active': newValue });
  }

  @action
  async saveConfig(): Promise<void> {
    this.isSaving = true;

    try {
      await this.liveCallWidget.updateConfig({
        'meet-link': this.meetLink,
        'host-name': this.hostName,
        'host-title': this.hostTitle,
        'avatar-url': this.avatarUrl,
        'cta-text': this.ctaText,
        'button-text': this.buttonText,
        'audience-filter': this.audienceFilter,
        'geo-filter': this.geoFilter,
      });
    } finally {
      this.isSaving = false;
    }
  }

  @action
  async markUserSpoken(): Promise<void> {
    if (!this.markSpokenUsername.trim()) return;

    const result = await this.liveCallWidget.markUserSpoken(this.markSpokenUsername.trim());

    if (result.success) {
      this.markSpokenStatus = `Marked ${this.markSpokenUsername} as spoken to`;
      this.markSpokenUsername = '';
    } else {
      this.markSpokenStatus = result.error ?? 'Error';
    }

    setTimeout(() => {
      this.markSpokenStatus = '';
    }, 3000);
  }

  @action
  updateField(field: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    (this as Record<string, unknown>)[field] = target.value;
  }
}
```

- [ ] **Step 2: Write the admin template**

```handlebars
{{! app/components/live-call-widget-admin/index.hbs }}
{{#if this.liveCallWidget.shouldShowAdminPanel}}
  <div class="fixed bottom-6 right-6 z-50" data-test-live-call-widget-admin>
    {{#if this.isExpanded}}
      {{! Expanded admin panel }}
      <div class="w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-gray-925">
        {{! Header }}
        <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-white/10">
          <span class="text-sm font-medium text-gray-950 dark:text-gray-100">Live Call Widget</span>
          <button
            type="button"
            class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            {{on "click" this.toggleExpanded}}
          >Collapse</button>
        </div>

        <div class="max-h-96 overflow-y-auto p-4 space-y-4">
          {{#if this.isLoading}}
            <p class="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
          {{else}}
            {{! Toggle }}
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-950 dark:text-gray-100">Active</span>
              <button
                type="button"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {{if this.isActive 'bg-teal-500' 'bg-gray-300 dark:bg-gray-700'}}"
                {{on "click" this.toggleActive}}
                data-test-live-call-widget-admin-toggle
              >
                <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {{if this.isActive 'translate-x-6' 'translate-x-1'}}"></span>
              </button>
            </div>

            {{! Status line }}
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{if this.isActive "Active" "Inactive"}} for: {{this.audienceFilter}} users, {{this.geoFilter}} geo
            </div>

            {{! Config fields }}
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Host Name</label>
                <input type="text" value={{this.hostName}} {{on "input" (fn this.updateField "hostName")}}
                  class="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-950 dark:border-white/10 dark:bg-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Host Title</label>
                <input type="text" value={{this.hostTitle}} {{on "input" (fn this.updateField "hostTitle")}}
                  class="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-950 dark:border-white/10 dark:bg-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Avatar URL</label>
                <input type="text" value={{this.avatarUrl}} {{on "input" (fn this.updateField "avatarUrl")}}
                  placeholder={{this.authenticator.currentUser.avatarUrl}}
                  class="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-950 dark:border-white/10 dark:bg-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">CTA Text</label>
                <input type="text" value={{this.ctaText}} {{on "input" (fn this.updateField "ctaText")}}
                  class="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-950 dark:border-white/10 dark:bg-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Button Text</label>
                <input type="text" value={{this.buttonText}} {{on "input" (fn this.updateField "buttonText")}}
                  class="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-950 dark:border-white/10 dark:bg-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Meet Link</label>
                <input type="text" value={{this.meetLink}} {{on "input" (fn this.updateField "meetLink")}}
                  class="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-950 dark:border-white/10 dark:bg-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Audience</label>
                <select {{on "change" (fn this.updateField "audienceFilter")}}
                  class="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-950 dark:border-white/10 dark:bg-gray-900 dark:text-gray-100">
                  <option value="all" selected={{this.isAudienceAll}}>All Users</option>
                  <option value="paid_only" selected={{this.isAudiencePaid}}>Paid Only</option>
                  <option value="free_only" selected={{this.isAudienceFree}}>Free Only</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Geography</label>
                <select {{on "change" (fn this.updateField "geoFilter")}}
                  class="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-950 dark:border-white/10 dark:bg-gray-900 dark:text-gray-100">
                  <option value="all" selected={{this.isGeoAll}}>All Regions</option>
                  <option value="us_only" selected={{this.isGeoUs}}>US Only</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              class="w-full rounded-md bg-teal-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600 disabled:opacity-50"
              {{on "click" this.saveConfig}}
              disabled={{this.isSaving}}
            >
              {{if this.isSaving "Saving..." "Save Config"}}
            </button>

            {{! Mark as spoken to }}
            <div class="border-t border-gray-200 pt-3 dark:border-white/10">
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Mark User as Spoken To</label>
              <div class="flex gap-2">
                <input type="text" value={{this.markSpokenUsername}} {{on "input" (fn this.updateField "markSpokenUsername")}}
                  placeholder="username"
                  class="flex-1 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-950 dark:border-white/10 dark:bg-gray-900 dark:text-gray-100" />
                <button
                  type="button"
                  class="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  {{on "click" this.markUserSpoken}}
                >Mark</button>
              </div>
              {{#if this.markSpokenStatus}}
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{this.markSpokenStatus}}</p>
              {{/if}}
            </div>
          {{/if}}
        </div>
      </div>
    {{else}}
      {{! Collapsed indicator }}
      <button
        type="button"
        class="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-lg transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-gray-925 dark:hover:bg-gray-900"
        {{on "click" this.toggleExpanded}}
        data-test-live-call-widget-admin-button
      >
        <span class="relative flex h-3 w-3">
          {{#if this.isActive}}
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
            <span class="relative inline-flex h-3 w-3 rounded-full bg-teal-500"></span>
          {{else}}
            <span class="relative inline-flex h-3 w-3 rounded-full bg-gray-400"></span>
          {{/if}}
        </span>
      </button>
    {{/if}}
  </div>
{{/if}}
```

- [ ] **Step 3: Commit**

```bash
git add app/components/live-call-widget-admin/
git commit -m "feat: add live call widget admin panel component"
```

---

### Task 11: Application Template Integration + Beacon Hiding

**Files:**
- Modify: `app/templates/application.hbs`
- Modify: `app/services/beacon.ts`
- Create: `app/instance-initializers/live-call-widget.ts`

**Working directory:** `/Users/sarupbanskota/gig/cc/work/frontend`

- [ ] **Step 1: Create instance initializer for boot-time setup**

```typescript
// app/instance-initializers/live-call-widget.ts
import type ApplicationInstance from '@ember/application/instance';
import type LiveCallWidgetService from 'codecrafters-frontend/services/live-call-widget';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export function initialize(applicationInstance: ApplicationInstance) {
  const authenticator = applicationInstance.lookup('service:authenticator') as AuthenticatorService;
  const liveCallWidget = applicationInstance.lookup('service:live-call-widget') as LiveCallWidgetService;

  // Wait for user to be loaded, then subscribe and sync
  if (authenticator.isAuthenticated) {
    // Sync initial state from user model after it loads
    const checkUser = () => {
      if (authenticator.currentUserIsLoaded) {
        liveCallWidget.syncFromUser();
        liveCallWidget.subscribe();
      } else {
        setTimeout(checkUser, 100);
      }
    };

    checkUser();
  }
}

export default { initialize };
```

- [ ] **Step 2: Modify beacon service to hide when live call widget is visible**

In `app/services/beacon.ts`, inject the live call widget service and modify the `shouldShowBeacon` getter. Add at the top of the getter:

```typescript
@service declare liveCallWidget: LiveCallWidgetService;
```

And in the `get shouldShowBeacon()` computed property, add a check before the existing route-based logic:

```typescript
// If live call widget is visible, hide the beacon
if (this.liveCallWidget.shouldShowWidget) {
  return false;
}
```

Import the service type at the top of the file:

```typescript
import type LiveCallWidgetService from 'codecrafters-frontend/services/live-call-widget';
```

- [ ] **Step 3: Add widget components to application template**

In `app/templates/application.hbs`, add these two components just before the closing `</div>` of the main wrapper (alongside the existing `<HelpscoutBeacon />`):

```handlebars
<LiveCallWidget />
<LiveCallWidgetAdmin />
```

- [ ] **Step 4: Verify the app compiles and starts**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: No type errors from the new files.

- [ ] **Step 5: Commit**

```bash
git add app/instance-initializers/live-call-widget.ts app/services/beacon.ts app/templates/application.hbs
git commit -m "feat: integrate live call widget into app shell with beacon hiding"
```

---

### Task 12: Manual Integration Testing

**Working directory:** Both core and frontend

- [ ] **Step 1: Start the core backend**

Ensure the core Rails server is running.

- [ ] **Step 2: Start the frontend dev server**

Run the Ember dev server.

- [ ] **Step 3: Test the admin panel**

1. Log in as a staff user
2. Verify the collapsed admin indicator appears in the bottom-right
3. Click to expand — verify config fields load
4. Fill in host name, title, CTA, button text, and a Meet link
5. Click Save Config
6. Toggle the widget on
7. Verify the toggle state persists

- [ ] **Step 4: Test the user-facing widget**

1. Open a separate browser / incognito window
2. Log in as a non-staff paid user
3. Verify the widget appears (if staff toggled it on in step 3)
4. Click "Join Video Call" — verify Meet opens in a new tab
5. Have staff toggle off — verify widget disappears without page reload

- [ ] **Step 5: Test mark as spoken to**

1. In the admin panel, type the non-staff user's username in "Mark as spoken to"
2. Click Mark
3. Refresh the non-staff user's page
4. Verify the widget no longer appears for that user (even when staff toggles on again)

- [ ] **Step 6: Test HelpScout replacement**

1. Navigate to a page where HelpScout beacon is normally visible
2. Have staff toggle the widget on
3. Verify HelpScout disappears and the live call widget appears
4. Have staff toggle off
5. Verify HelpScout returns
