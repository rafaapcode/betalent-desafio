import Client from '#models/client'
import { DateTime } from 'luxon'
import { v7 } from 'uuid'
import { ServiceResponse } from '../../types/response.js'

export default class ClientsService {
  async createClients(email: string, name: string): Promise<ServiceResponse<Client>> {
    const clientExits = await Client.findBy('email', email)

    if (clientExits && !clientExits.deleted_at) {
      return {
        statusCode: 400,
        body: {
          message: 'Client already exists',
          status: false,
        },
      }
    }

    if (!clientExits) {
      const client = await Client.create({
        id: v7(),
        email,
        name,
      })

      return {
        statusCode: 201,
        body: {
          message: 'Client created successfully',
          status: true,
          data: client,
        },
      }
    }

    clientExits.name = name
    clientExits.deleted_at = null

    await clientExits.save()

    return {
      statusCode: 201,
      body: {
        message: 'Client created successfully',
        status: true,
        data: clientExits,
      },
    }
  }

  async updateClients(
    emailparam: string,
    clientData: { email?: string; name?: string }
  ): Promise<ServiceResponse<Client>> {
    const client = await Client.findBy('email', emailparam)

    if (!client || (client && client.deleted_at)) {
      return {
        statusCode: 404,
        body: {
          message: 'Client not found',
          status: false,
        },
      }
    }

    client.email = clientData?.email ? clientData?.email : client.email
    client.name = clientData?.name ? clientData?.name : client.name

    await client.save()

    return {
      statusCode: 200,
      body: {
        status: true,
        message: 'Client updated successfully',
      },
    }
  }

  async deleteClients(email: string): Promise<ServiceResponse<Client>> {
    if (!email) {
      return {
        statusCode: 400,
        body: {
          message: 'Email is required',
          status: false,
        },
      }
    }

    const client = await Client.findBy('email', email)

    if (!client) {
      return {
        statusCode: 404,
        body: {
          message: 'Client not found',
          status: false,
        },
      }
    }

    client.deleted_at = DateTime.local()

    await client.save()

    return {
      statusCode: 200,
      body: {
        message: 'Client deleted successfully',
        status: true,
      },
    }
  }

  async getClients(filterParam: string): Promise<ServiceResponse<Client>> {
    if (!filterParam) {
      return {
        statusCode: 400,
        body: {
          status: false,
          message: 'Get client by email or name',
        },
      }
    }

    const client = await Client.query()
      .where('email', filterParam)
      .andWhereNull('deleted_at')
      .orWhere('name', decodeURIComponent(filterParam))
      .first()

    if (!client) {
      return {
        statusCode: 404,
        body: {
          status: false,
          message: 'Client not found',
        },
      }
    }

    return {
      statusCode: 200,
      body: {
        status: true,
        data: client,
      },
    }
  }

  async getAllClients() {
    const client = await Client.query().select('name', 'email').whereNull('deleted_at')

    return {
      client,
    }
  }

  async clientDetailsAndTransactions(email: string): Promise<ServiceResponse<Client>> {
    if (!email) {
      return {
        statusCode: 400,
        body: {
          message: 'Email is required',
          status: false,
        },
      }
    }

    const client = await Client.query()
      .where('email', email)
      .andWhereNull('deleted_at')
      .preload('transactions', (queryTr) =>
        queryTr
          .preload('product', (productTx) => productTx.select('name', 'amount', 'price'))
          .select(
            'id',
            'product_id',
            'external_id',
            'status',
            'amount',
            'quantity',
            'card_last_numbers',
            'created_at',
            'updated_at'
          )
      )

    if (!client[0]) {
      return {
        statusCode: 404,
        body: {
          message: 'Client not found',
          status: false,
        },
      }
    }

    return {
      statusCode: 200,
      body: {
        status: true,
        data: client[0],
      },
    }
  }
}
