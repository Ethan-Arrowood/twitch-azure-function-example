import { Type } from '@sinclair/typebox'

// Schemas based on reference at https://dev.twitch.tv/docs/api/reference

export const schemaKeys = {
  twitch: {
    oauth2: {
      token: {
        response: 'twitch.oath2.token.response'
      }
    },
    helix: {
      streams: {
        response: 'twitch.helix.streams.response'
      },
      games: {
        response: 'twitch.helix.games.response'
      }
    }
  }
}

export const schemas = {
  twitch: {
    oauth2: {
      token: {
        response: Type.Object({
          access_token: Type.String(),
          refresh_token: Type.Optional(Type.String()),
          expires_in: Type.Number(),
          scope: Type.Optional(Type.Array(Type.String())),
          token_type: Type.String(),
        }, {
          $id: schemaKeys.twitch.oauth2.token.response,
          additionalProperties: false
        })
      }
    },
    helix: {
      streams: {
        response: Type.Object({
          data: Type.Array(
            Type.Object({
              id: Type.String(),
              user_id: Type.String(),
              user_login: Type.String(),
              user_name: Type.String(),
              game_id: Type.String(),
              game_name: Type.String(),
              type: Type.String(),
              title: Type.String(),
              viewer_count: Type.Number(),
              started_at: Type.String(),
              language: Type.String(),
              thumbnail_url: Type.String(),
              tag_ids: Type.Array(Type.String()),
              is_mature: Type.Boolean()
            })
          ),
          pagination: Type.Object({
            cursor: Type.String(),
          }),
        }, {
          $id: schemaKeys.twitch.helix.streams.response,
          additionalProperties: false
        })
      },
      games: {
        response: Type.Object({
          data: Type.Array(
            Type.Object({
              box_art_url: Type.String(),
              id: Type.String(),
              name: Type.String()
            })
          )
        }, {
          $id: schemaKeys.twitch.helix.games.response,
          additionalProperties: false
        })
      }
    }
  }
}