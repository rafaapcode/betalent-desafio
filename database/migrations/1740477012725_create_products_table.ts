import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').index()
      table.integer('amount')
      table.float('price')
      table.text('description')

      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable().defaultTo(null)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
