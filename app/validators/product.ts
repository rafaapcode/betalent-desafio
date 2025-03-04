import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2),
    amount: vine.number().positive(),
    price: vine.number().positive(),
    description: vine.string().minLength(5),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).optional(),
    amount: vine.number().positive().optional(),
    price: vine.number().positive().optional(),
    description: vine.string().minLength(5).optional(),
  })
)
