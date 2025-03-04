import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions_products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('transaction_id').references('transactions.id').onDelete('CASCADE')
      table.uuid('product_id').references('products.id').onDelete('CASCADE')
      table.unique(['transaction_id', 'product_id'])
      table.float('value')
      table.integer('quantity')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
