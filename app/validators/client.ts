import vine from '@vinejs/vine'

export const createClientValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .minLength(3)
      .unique(async (db, value) => {
        const row = await db.from('clients').where('name', value).first()
        return row === null
      }),
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const row = await db
          .from('clients')
          .where('email', value)
          .andWhereNull('deleted_at')
          .first()
        return row === null
      }),
  })
)

export const updateClientValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const row = await db
          .from('clients')
          .where('email', value)
          .andWhereNull('deleted_at')
          .first()
        return row === null
      })
      .optional(),
    name: vine.string().optional(),
  })
)
