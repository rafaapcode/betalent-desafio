import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { v7 } from 'uuid'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        id: v7(),
        email: 'rafaap2003@gmail.com',
        role: 'ADMIN',
        password: 'teste123',
      },
      {
        id: v7(),
        email: 'rafaap2003manager@gmail.com',
        role: 'MANAGER',
        password: 'teste123',
      },
      {
        id: v7(),
        email: 'rafaap2003finance@gmail.com',
        role: 'FINANCE',
        password: 'teste123',
      },
      {
        id: v7(),
        email: 'rafaap2003user@gmail.com',
        role: 'USER',
        password: 'teste123',
      },
    ])
  }
}
