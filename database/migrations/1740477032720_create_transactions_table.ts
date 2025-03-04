import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('client_id').references('clients.id').onDelete('CASCADE')
      table.uuid('gateway_id').references('gateways.id').onDelete('CASCADE')
      table.uuid('product_id').references('products.id').onDelete('CASCADE')
      table.text('external_id')
      table.string('status')
      table.bigint('amount')
      table.integer('quantity')
      table.integer('card_last_numbers')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
