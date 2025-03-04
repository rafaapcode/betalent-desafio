import type { HttpContext } from '@adonisjs/core/http'

import ClientsService from '#services/clients_service'
import { createClientValidator, updateClientValidator } from '#validators/client'
import { inject } from '@adonisjs/core'

@inject()
export default class ClientsController {
  constructor(protected clientService: ClientsService) {}

  async createClients({ request, response }: HttpContext) {
    const data = request.all()
    const { email, name } = await createClientValidator.validate(data)

    const { body, statusCode } = await this.clientService.createClients(email, name)

    return response.status(statusCode).json(body)
  }

  async updateClients({ request, response }: HttpContext) {
    const emailParam = request.param('email')
    const data = request.all()

    const clientData = await updateClientValidator.validate(data)

    const { body, statusCode } = await this.clientService.updateClients(emailParam, clientData)

    return response.status(statusCode).json(body)
  }

  async deleteClients({ request, response }: HttpContext) {
    const emailParam = request.param('email')

    const { body, statusCode } = await this.clientService.deleteClients(emailParam)

    return response.status(statusCode).json(body)
  }

  async getClients({ request, response }: HttpContext) {
    const filterParam = request.param('filter')

    const { body, statusCode } = await this.clientService.getClients(filterParam)

    return response.status(statusCode).json(body)
  }

  async getAllClients() {
    return await this.clientService.getAllClients()
  }

  async getDetails({ request, response }: HttpContext) {
    const emailParam = request.param('email')

    const { body, statusCode } = await this.clientService.clientDetailsAndTransactions(emailParam)

    return response.status(statusCode).json(body)
  }
}
