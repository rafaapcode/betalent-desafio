import Gateway from '#models/gateway'
import { ServiceResponse } from '../../types/response.js'

export default class GatewayService {
  async toggleGateway(name: string): Promise<ServiceResponse<Gateway>> {
    if (!name) {
      return {
        statusCode: 400,
        body: {
          status: false,
          message: 'Name is required',
        },
      }
    }

    const gateway = await Gateway.findBy('name', decodeURIComponent(name))

    if (!gateway) {
      return {
        statusCode: 404,
        body: {
          status: false,
          message: 'Gateway not found',
        },
      }
    }

    gateway.is_active = !gateway.is_active

    await gateway.save()

    return {
      statusCode: 200,
      body: {
        status: true,
        message: `${gateway.is_active ? 'Gateway activated successfully' : 'Gateway deactivated successfully'}`,
      },
    }
  }

  async changeThePriority(name: string, priority: number): Promise<ServiceResponse<Gateway>> {
    if (!name) {
      return {
        statusCode: 400,
        body: {
          status: false,
          message: 'Name is required',
        },
      }
    }

    const gateway = await Gateway.findBy('name', decodeURIComponent(name))

    if (!gateway) {
      return {
        statusCode: 404,
        body: {
          status: false,
          message: 'Gateway not found',
        },
      }
    }

    const gatewayWithPriority = await Gateway.findBy('priority', priority)

    if (gatewayWithPriority) {
      gatewayWithPriority.priority = gateway.priority
      await gatewayWithPriority.save()
    }

    gateway.priority = priority

    await gateway.save()

    return {
      statusCode: 200,
      body: {
        status: true,
        message: `The gateway ${gateway.name} now has the ${gateway.priority} priority`,
      },
    }
  }
}
