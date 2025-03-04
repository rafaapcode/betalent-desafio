import Gateway from '#models/gateway'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { v7 } from 'uuid'

export default class extends BaseSeeder {
  async run() {
    await Gateway.createMany([
      {
        id: v7(),
        name: 'Gateway_1',
        is_active: true,
        priority: 1,
      },
      {
        id: v7(),
        name: 'Gateway_2',
        is_active: true,
        priority: 2,
      },
    ])
  }
}
