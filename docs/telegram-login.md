# Telegram login bridge

Existing Nexus players can sign in without sharing their Minecraft password with
the website.

## Runtime configuration

Generate one random secret of at least 32 characters and store the same value in
both runtimes:

- Cloudflare Worker secret: `TELEGRAM_LINK_SECRET`
- NexusBot environment variable or `config/nexusbot.json`: `website_link_secret`

The bot also needs:

```json
{
  "website_url": "https://nexusmc.flux-productions.com",
  "website_link_secret": "replace-with-the-shared-random-secret"
}
```

Do not commit the real secret.

## Flow

1. The player enters their Minecraft nickname on `/login`.
2. The website creates an eight-character, ten-minute challenge.
3. The player opens `@nexusmcabot` or sends `/site CODE`.
4. NexusBot reads its own `telegram_users.minecraft_name` link and confirms the
   challenge over HTTPS.
5. The website creates a normal website session. No Minecraft password or bot
   database file is sent to the website.
