import UserService from '#services/user_service'
import {
  createUserValidator,
  deleteUserValidator,
  loginUserValidator,
  updateUserValidator,
} from '#validators/user'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UserController {
  constructor(protected userService: UserService) {}

  async loginUser({ request, auth }: HttpContext) {
    const data = request.all()
    const { email, password } = await loginUserValidator.validate(data)

    const user = await this.userService.verifyUser(email, password)

    const token = await auth.use('jwt').generate(user)

    return {
      access_token: token.token,
    }
  }

  async createUser({ request, response }: HttpContext) {
    const data = request.all()
    const { email, password, role } = await createUserValidator.validate(data)

    const { body, statusCode } = await this.userService.createUser({ email, password, role })

    return response.status(statusCode).json(body)
  }

  async updateUser({ request, response }: HttpContext) {
    const emailParam = request.param('email')
    const data = request.all()

    const userData = await updateUserValidator.validate(data)

    const { body, statusCode } = await this.userService.updateUser(emailParam, userData)

    return response.status(statusCode).json(body)
  }

  async deleteUser({ request, response }: HttpContext) {
    const emailParam = request.params()

    const { email } = await deleteUserValidator.validate(emailParam)

    const { body, statusCode } = await this.userService.deleteUser(email)

    return response.status(statusCode).json(body)
  }

  async getUser({ request, response }: HttpContext) {
    const filterParam = request.param('filter')

    const { body, statusCode } = await this.userService.getUser(filterParam)

    return response.status(statusCode).json(body)
  }

  async getAllUser() {
    return await this.userService.getAllUser()
  }
}
