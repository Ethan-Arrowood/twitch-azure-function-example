# Twitch Azure Function Example

This repo contains a Node.js/TypeScript Azure Function example that utilizes the Twitch API. The Function is a HTTP Trigger that returns a random live stream based on a given game. You can specify a game using the `game` query parameter (defaults to `"minecraft"`).

In order to run this Function you need to specify two application settings (a.k.a. environment variables). You can find these values on your Twitch Developer page.

```sh
TWITCH_CLIENT_ID
TWITCH_CLIENT_SECRET
```

When developing locally, define a `local.settings.json` file in the root of the function app

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "TWITCH_CLIENT_ID": "",
    "TWITCH_CLIENT_SECRET": ""
  }
}
```

## Examples

> Response data has been replaced with fake values

### Default

URL: `https://etarrowo-az-func-upskilling.azurewebsites.net/api/getvideostream`

Response:

```json
{
  "id": "111",
  "user_id": "001",
  "user_login": "steve",
  "user_name": "steve",
  "game_id": "27471",
  "game_name": "Minecraft",
  "type": "live",
  "title": "Minecraft Survival",
  "viewer_count": 1000,
  "started_at": "",
  "language": "en",
  "thumbnail_url": "",
  "tag_ids": [],
  "is_mature": false
}
```

### Game Specified

URL: `https://etarrowo-az-func-upskilling.azurewebsites.net/api/getvideostream?game=league%20of%20legends`

```json
{
  "id": "222",
  "user_id": "002",
  "user_login": "ashe",
  "user_name": "Ashe",
  "game_id": "21779",
  "game_name": "League of Legends",
  "type": "live",
  "title": "Summoner's Rift",
  "viewer_count": 1000,
  "started_at": "",
  "language": "en",
  "thumbnail_url": "",
  "tag_ids": [],
  "is_mature": false
}
```
