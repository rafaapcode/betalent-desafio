import env from '#start/env'
import { defineConfig, targets } from '@adonisjs/core/logger'
import app from '@adonisjs/core/services/app'

const loggerConfig = defineConfig({
  default: 'app',

  loggers: {
    app: {
      enabled: true,
      name: env.get('APP_NAME'),
      level: env.get('LOG_LEVEL'),
      transport: {
        targets: targets()
          .pushIf(!app.inProduction, {
            target: 'pino-pretty',
            level: 'info',
            options: {},
          })
          .pushIf(app.inProduction, {
            target: 'pino/file',
            level: 'info',
            options: {
              destination: 1,
            },
          })
          .toArray(),
      },
    },
  },
})

export default loggerConfig
declare module '@adonisjs/core/types' {
  export interface LoggersList extends InferLoggers<typeof loggerConfig> {}
}
