import Transaction from '#models/transaction'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare amount: number

  @column()
  declare price: number

  @column()
  declare description: string

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @column.dateTime()
  declare deleted_at: DateTime | null
}
