export function getEnvVar(variable: string): string {
  const v = process.env[variable]

  if (typeof v === 'string') {
      return v
  }

  throw new Error(`Missing environment variable ${variable}`)
}

export const ENV = {
  TWITCH_CLIENT_ID: getEnvVar('TWITCH_CLIENT_ID'),
  TWITCH_CLIENT_SECRET: getEnvVar('TWITCH_CLIENT_SECRET'),
}