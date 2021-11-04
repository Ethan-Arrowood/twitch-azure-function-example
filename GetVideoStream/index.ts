import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import ValidationError from "ajv/dist/runtime/validation_error"
import undici from 'undici'
import { validators } from '../validation'
import { getEnv } from '../environment'

const ENV = getEnv()

async function authenticate () {
    const url = new URL('https://id.twitch.tv/oauth2/token')
    url.searchParams.append('client_id', ENV.TWITCH_CLIENT_ID)
    url.searchParams.append('client_secret', ENV.TWITCH_CLIENT_SECRET)
    url.searchParams.append('grant_type', 'client_credentials')
    url.searchParams.append('scope','')

    const response = await undici.request(url, { method: 'POST' })
    const data = await response.body.json()

    if (validators.twitch.oath2.token.response(data)) {
        return data.access_token
    } else {
        throw new ValidationError(validators.twitch.oath2.token.response.errors!)
    }
}

async function getGame (accessToken: string, game = 'minecraft') {
    const url = new URL('https://api.twitch.tv/helix/games')
    url.searchParams.append('name', game)

    const response = await undici.request(url, {
        method: 'GET',
        headers: [
            'Authorization', `Bearer ${accessToken}`,
            'Client-Id', ENV.TWITCH_CLIENT_ID
        ]
    })

    const data = await response.body.json()

    if (validators.twitch.helix.games.response(data)) {
        return data.data[0].id
    } else {
        throw new ValidationError(validators.twitch.helix.games.response.errors!)
    }
}

async function getRandomStream (accessToken: string, gameId: string) {
    const url = new URL('https://api.twitch.tv/helix/streams')
    url.searchParams.append('game_id', gameId)

    const response = await undici.request(url, {
        method: 'GET',
        headers: [
            'Authorization', `Bearer ${accessToken}`,
            'Client-Id', ENV.TWITCH_CLIENT_ID
        ]
    })

    const data = await response.body.json()

    if (validators.twitch.helix.streams.response(data)) {
        const r = Math.floor(Math.random() * data.data.length)
        return data.data[r]
    } else {
        throw new ValidationError(validators.twitch.helix.streams.response.errors!)
    }
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        const accessToken = await authenticate()
        const gameId = await getGame(accessToken, context.req?.query['game'])
        const stream = await getRandomStream(accessToken, gameId)
        context.res = {
            status: 200,
            body: stream
        };
    } catch (error) {
        context.log.error(error)
        if (error instanceof ValidationError) {
            context.res = {
                status: 500,
                body: `Validation Error: ${error.message}`
            }
        } else if (error instanceof Error) {
            context.res = {
                status: 500,
                body: error.message
            }
        } else {
            context.res = {
                status: 500,
            }
        }
    }
};

export default httpTrigger;