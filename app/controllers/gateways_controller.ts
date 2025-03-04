import GatewayService from '#services/gateway_service'
import { changeGatewayPriorityValidator } from '#validators/gateway'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class GatewaysController {
  constructor(protected gatewayService: GatewayService) {}

  async toggleGateway({ request, response }: HttpContext) {
    const name = request.param('name')

    const { body, statusCode } = await this.gatewayService.toggleGateway(name)
    return response.status(statusCode).json(body)
  }

  async changeThePriority({ request, response }: HttpContext) {
    const name = request.param('name')

    const data = request.all()

    const { priority } = await changeGatewayPriorityValidator.validate(data)

    const { body, statusCode } = await this.gatewayService.changeThePriority(name, priority)
    return response.status(statusCode).json(body)
  }
}
