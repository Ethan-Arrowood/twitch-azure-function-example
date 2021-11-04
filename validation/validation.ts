import Ajv from 'ajv/dist/2019'
import { Static } from '@sinclair/typebox'
import { schemaKeys, schemas } from './schemas'

export const ajv = new Ajv({}).addKeyword('kind').addKeyword('modifier')

ajv.addSchema(schemas.twitch.oauth2.token.response, schemaKeys.twitch.oauth2.token.response)
ajv.addSchema(schemas.twitch.helix.streams.response, schemaKeys.twitch.helix.streams.response)
ajv.addSchema(schemas.twitch.helix.games.response, schemaKeys.twitch.helix.games.response)

export const validators = {
  twitch: {
    oath2: {
      token: {
        response: ajv.getSchema<Static<typeof schemas.twitch.oauth2.token.response>>(schemaKeys.twitch.oauth2.token.response)!
      }
    },
    helix: {
      streams: {
        response: ajv.getSchema<Static<typeof schemas.twitch.helix.streams.response>>(schemaKeys.twitch.helix.streams.response)!
      },
      games: {
        response: ajv.getSchema<Static<typeof schemas.twitch.helix.games.response>>(schemaKeys.twitch.helix.games.response)!
      }
    }
  }
}
