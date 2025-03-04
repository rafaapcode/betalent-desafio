import Client from '#models/client'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { v7 } from 'uuid'

export default class extends BaseSeeder {
  async run() {
    await Client.createMany([
      {
        id: v7(),
        email: 'Sincere@april.biz',
        name: 'Leanne Graham',
      },
      {
        id: v7(),
        email: 'Nathan@yesenia.net',
        name: 'Clementine Bauch',
      },
    ])
  }
}
