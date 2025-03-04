import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
  APP_NAME: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string(),
  DB_DATABASE: Env.schema.string(),
  BASE_URL_GATEWAY1: Env.schema.string(),
  BASE_URL_GATEWAY2: Env.schema.string(),
  Gateway_Auth_Token: Env.schema.string(),
  Gateway_Auth_Secret: Env.schema.string(),
  EMAIL_GATEWAY1_LOGIN: Env.schema.string({ format: 'email' }),
  TOKEN_GATEWAY1_LOGIN: Env.schema.string(),
})
