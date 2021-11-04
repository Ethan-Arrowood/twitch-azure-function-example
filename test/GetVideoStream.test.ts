import { Context, HttpRequest } from '@azure/functions'
import tap from 'tap'
import undici from 'undici'
const TWITCH_CLIENT_ID = 'twitch_client_id'
const TWITCH_CLIENT_SECRET = 'twitch_client_secret'
process.env['TWITCH_CLIENT_ID'] = TWITCH_CLIENT_ID
process.env['TWITCH_CLIENT_SECRET'] = TWITCH_CLIENT_SECRET
import httpTrigger from '../GetVideoStream'

const defaultContext = {
  log: console
} as any as Context

tap.test('default flow', async t => {
  const mockAgent = new undici.MockAgent({ connections: 1 })

  const access_token = 'acces_token'

  mockAgent
    .get('https://id.twitch.tv')
    .intercept({
      path: `/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials&scope=`,
      method: 'POST'
    }).reply(200, JSON.stringify({
      access_token: access_token,
      expires_in: 1,
      token_type: ''
    }))

  const game_id = 'game_id'

  mockAgent
    .get('https://api.twitch.tv')
    .intercept({
      path: '/helix/games?name=minecraft',
      method: 'GET'
    }).reply(200, {
      data: [{
        box_art_url: '',
        id: game_id,
        name: ''
      }]
    })

  const stream = {
    "id": "0000",
    "user_id": "0000",
    "user_login": "steve",
    "user_name": "steve",
    "game_id": "0000",
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

  mockAgent
    .get('https://api.twitch.tv')
    .intercept({
      path: `/helix/streams?game_id=${game_id}`,
      method: 'GET'
    }).reply(200, {
      data: [stream],
      pagination: {
        cursor: ''
      }
    })

  undici.setGlobalDispatcher(mockAgent)

  const context = defaultContext

  await httpTrigger(context)

  t.equal(context.res?.status, 200)
  t.same(context.res?.body, stream)
  t.end()
})

tap.test('game query specified', async t => {
  const mockAgent = new undici.MockAgent({ connections: 1 })

  const access_token = 'acces_token'

  mockAgent
    .get('https://id.twitch.tv')
    .intercept({
      path: `/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials&scope=`,
      method: 'POST'
    }).reply(200, JSON.stringify({
      access_token: access_token,
      expires_in: 1,
      token_type: ''
    }))

  const game_query = 'game_query'
  const game_id = 'game_id'

  mockAgent
    .get('https://api.twitch.tv')
    .intercept({
      path: `/helix/games?name=${game_query}`,
      method: 'GET'
    }).reply(200, {
      data: [{
        box_art_url: '',
        id: game_id,
        name: ''
      }]
    })

  const stream = {
    "id": "0000",
    "user_id": "0000",
    "user_login": "pikachu",
    "user_name": "pikachu",
    "game_id": "0000",
    "game_name": "Pokemon",
    "type": "live",
    "title": "Pallet Town",
    "viewer_count": 1000,
    "started_at": "",
    "language": "en",
    "thumbnail_url": "",
    "tag_ids": [],
    "is_mature": false
  }

  mockAgent
    .get('https://api.twitch.tv')
    .intercept({
      path: `/helix/streams?game_id=${game_id}`,
      method: 'GET'
    }).reply(200, {
      data: [stream],
      pagination: {
        cursor: ''
      }
    })

  undici.setGlobalDispatcher(mockAgent)

  const context = defaultContext
  context.req = { query: { game: game_query }} as unknown as HttpRequest

  await httpTrigger(context)

  t.equal(context.res?.status, 200)
  t.same(context.res?.body, stream)
  t.end()
})