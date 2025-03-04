import vine from '@vinejs/vine'

export const changeGatewayPriorityValidator = vine.compile(
  vine.object({
    priority: vine.number().positive(),
  })
)
