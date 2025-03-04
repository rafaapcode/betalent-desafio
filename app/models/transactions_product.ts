import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class TransactionsProduct extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare transaction_id: string

  @column()
  declare product_id: string

  @column()
  declare value: number

  @column()
  declare quantity: number

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime
}
