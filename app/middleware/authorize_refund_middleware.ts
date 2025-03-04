import { refund } from '#abilities/main'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthorizeRefundMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { auth, bouncer, response } = ctx
    const userFromAuth = auth.user
    if (!userFromAuth) {
      return response.status(400).json({ message: 'User not found in the auth' })
    }

    const isNotAuthorized = await bouncer.denies(refund)

    if (isNotAuthorized) {
      return response
        .status(401)
        .json({ message: 'You are  not authorized to perform this action' })
    }

    return await next()
  }
}
