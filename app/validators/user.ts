import vine from '@vinejs/vine'

export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8),
  })
)

export const createUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const row = await db.from('users').where('email', value).first()
        return row === null
      }),
    password: vine.string().minLength(8),
    role: vine.enum(['ADMIN', 'MANAGER', 'FINANCE', 'USER']),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const row = await db.from('users').where('email', value).first()
        return row === null
      })
      .optional(),
    password: vine.string().minLength(8).optional(),
    role: vine.enum(['ADMIN', 'MANAGER', 'FINANCE', 'USER']).optional(),
  })
)

export const deleteUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)
