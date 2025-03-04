import vine from '@vinejs/vine'

export const createTransactionValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3),
    email: vine.string().email(),
    cardNumber: vine.string().creditCard(),
    cvv: vine.string().fixedLength(3),
    productName: vine.string().minLength(2),
    quantity: vine.number().positive(),
  })
)
