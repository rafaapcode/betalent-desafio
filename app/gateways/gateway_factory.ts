import { Gateway1Adapter } from './adapters/gateway_adapter_1.js'
import { Gateway2Adapter } from './adapters/gateway_adapter_2.js'
import { PaymentGateway } from './payment_gateway.js'

const GATEWAY_PRIORITY: Record<string, PaymentGateway> = {
  Gateway_1: new Gateway1Adapter(),
  Gateway_2: new Gateway2Adapter(),
}

export class GatewayFactory {
  static getGateway(gatewayName: string): PaymentGateway | null {
    if (GATEWAY_PRIORITY[gatewayName]) {
      return GATEWAY_PRIORITY[gatewayName]
    }
    return null
  }
}
