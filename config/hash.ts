import { defineConfig, drivers } from '@adonisjs/core/hash'

const hashConfig = defineConfig({
  default: 'bcrypt',

  list: {
    bcrypt: drivers.bcrypt({
      rounds: 10,
      saltSize: 16,
    }),
  },
})

export default hashConfig

declare module '@adonisjs/core/types' {
  export interface HashersList extends InferHashers<typeof hashConfig> {}
}
