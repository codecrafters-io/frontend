---
name: toggle-maintenance-mode
description: Enable or disable maintenance mode for the frontend. Use when the user asks to put the site in maintenance mode, take it down for maintenance, or bring it back up after maintenance.
---

# Toggle Maintenance Mode

Maintenance mode redirects all traffic to a static maintenance page hosted on the main site.

## Enable Maintenance Mode

Add this redirect as the **first entry** in the `redirects` array in `vercel.json`:

```json
{ "source": "/(.*)", "destination": "https://codecrafters.io/heroku_pages/maintenance.html", "permanent": false },
```

It must be the first redirect so it catches all requests before any other rules.

After adding, commit and deploy.

## Disable Maintenance Mode

Remove the maintenance redirect line from `vercel.json`, then commit and deploy.
