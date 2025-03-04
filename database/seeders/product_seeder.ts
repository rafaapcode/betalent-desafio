import Product from '#models/product'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { v7 } from 'uuid'

export default class extends BaseSeeder {
  async run() {
    await Product.createMany([
      {
        id: v7(),
        name: 'Tênis Esportivo',
        amount: 15,
        description: 'Tênis confortável para corrida',
        price: 129.99,
      },
      {
        id: v7(),
        name: 'Camiseta Dry Fit',
        amount: 25,
        description: 'Camiseta leve e respirável para treinos',
        price: 59.9,
      },
      {
        id: v7(),
        name: 'Mochila Fitness',
        amount: 8,
        description: 'Mochila espaçosa para academia e viagens',
        price: 149.99,
      },
      {
        id: v7(),
        name: 'Garrafa Térmica 1L',
        amount: 30,
        description: 'Garrafa térmica para manter sua água gelada por horas',
        price: 79.9,
      },
      {
        id: v7(),
        name: 'Bermuda Esportiva',
        amount: 20,
        description: 'Bermuda confortável e flexível para exercícios',
        price: 89.99,
      },
      {
        id: v7(),
        name: 'Luvas de Musculação',
        amount: 12,
        description: 'Luvas para proteção e aderência durante os treinos',
        price: 49.9,
      },
    ])
  }
}
