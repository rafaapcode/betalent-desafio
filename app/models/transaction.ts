import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Client from './client.js'
import Gateway from './gateway.js'
import Product from './product.js'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare client_id: string

  @column()
  declare gateway_id: string

  @column()
  declare external_id: string

  @column()
  declare status: string

  @column()
  declare amount: number

  @column()
  declare card_last_numbers: number

  @column()
  declare product_id: string

  @column()
  declare quantity: number

  @belongsTo(() => Product, {
    foreignKey: 'product_id',
  })
  declare product: BelongsTo<typeof Product>

  @belongsTo(() => Client, {
    foreignKey: 'client_id',
  })
  declare client: BelongsTo<typeof Client>

  @belongsTo(() => Gateway, {
    foreignKey: 'gateway_id',
  })
  declare gateway: BelongsTo<typeof Gateway>

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime
}
