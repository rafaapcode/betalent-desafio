import Client from '#models/client'
import { default as Gateway } from '#models/gateway'
import Product from '#models/product'
import Transaction from '#models/transaction'
import TransactionsProduct from '#models/transactions_product'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import { v7 } from 'uuid'
import { PaymentResponse } from '../../types/payment_adapter.js'
import { ServiceResponse } from '../../types/response.js'
import { BuyProductType } from '../../types/transactions.js'
import { GatewayFactory } from '../gateways/gateway_factory.js'
import { PaymentGateway } from '../gateways/payment_gateway.js'
import ClientsService from './clients_service.js'

@inject()
export default class TransactionService {
  constructor(protected clientService: ClientsService) {}

  async createTransaction(dataTr: BuyProductType): Promise<ServiceResponse<PaymentResponse>> {
    const { client, product } = await this.getOrCreateProductAndClientInformations(
      dataTr.productName,
      {
        name: dataTr.name,
        email: dataTr.email,
      }
    )

    const { statusCode: codeStatus, body: validatorRes } = await this.createTransactionValidator(
      product,
      dataTr.quantity
    )

    if (!validatorRes.status) {
      return {
        statusCode: codeStatus,
        body: {
          status: false,
          message: validatorRes.message,
        },
      }
    }

    const gateways = await this.getGatewaysInPriorityOrder()
    const quantityOfGatewaysInPriorityOrder = gateways.length

    if (quantityOfGatewaysInPriorityOrder === 0) {
      return {
        statusCode: 500,
        body: {
          status: false,
          message: 'Does not have any registered gateway or all gateway is deactivated',
        },
      }
    }

    for (let i = 0; i < quantityOfGatewaysInPriorityOrder; i++) {
      const gateway = gateways[i]
      const gatewayAdapter = gateway ? this.gateway(gateway.name) : null

      if (!gatewayAdapter) {
        return {
          statusCode: 500,
          body: {
            status: false,
            message: 'Gateway not found',
          },
        }
      }

      const totalPrice = product!.price * dataTr.quantity
      const { body, statusCode } = await gatewayAdapter.createTransaction({
        amount: Math.round(totalPrice),
        cardNumber: dataTr.cardNumber,
        cvv: dataTr.cvv,
        email: dataTr.email,
        name: dataTr.name,
      })

      if (body.status) {
        const transactionData = {
          amount: totalPrice,
          cardLastNumber: body.data?.card_last_digits!,
          clientId: client.id,
          externalId: body.data?.id!,
          gatewayId: gateway.id,
          productId: product!.id,
          quantity: dataTr.quantity,
          status: body.data?.status!,
        }

        await this.storeTransactionAndUpdateProduct(
          transactionData,
          product!.amount - dataTr.quantity
        )
        return {
          statusCode,
          body,
        }
      } else {
        if (i === quantityOfGatewaysInPriorityOrder - 1) {
          return {
            statusCode,
            body,
          }
        }
        continue
      }
    }

    return {
      statusCode: 500,
      body: {
        status: false,
        message: 'Erro ao processar sua transação.',
      },
    }
  }

  async listTransactions(): Promise<ServiceResponse<PaymentResponse[]>> {
    const gateways = await this.getGatewaysInPriorityOrder()
    const quantityOfGatewaysInPriorityOrder = gateways.length

    if (quantityOfGatewaysInPriorityOrder === 0) {
      return {
        statusCode: 500,
        body: {
          status: false,
          message: 'Does not have any registered gateway or all gateways is deactivated',
        },
      }
    }

    for (let i = 0; i < quantityOfGatewaysInPriorityOrder; i++) {
      const gateway = gateways[i]
      const gatewayAdapter = gateway ? this.gateway(gateway.name) : null

      if (!gatewayAdapter) {
        return {
          statusCode: 500,
          body: {
            status: false,
            message: 'Gateway not found',
          },
        }
      }

      const { body, statusCode } = await gatewayAdapter.listTransaction()

      if (body.status) {
        return {
          statusCode,
          body,
        }
      } else {
        if (i === quantityOfGatewaysInPriorityOrder - 1) {
          return {
            statusCode,
            body,
          }
        }
        continue
      }
    }

    return {
      statusCode: 500,
      body: {
        status: false,
        message: 'Erro ao processar sua transação.',
      },
    }
  }

  async refund(id: string): Promise<ServiceResponse<PaymentResponse>> {
    if (!id) {
      return {
        statusCode: 400,
        body: {
          status: false,
          message: 'Id is required',
        },
      }
    }

    const transaction = await Transaction.find(id)

    if (!transaction) {
      return {
        statusCode: 404,
        body: {
          status: false,
          message: 'Transaction not found',
        },
      }
    }

    const gateways = await this.getGatewaysInPriorityOrder()
    const quantityOfGatewaysInPriorityOrder = gateways.length

    if (quantityOfGatewaysInPriorityOrder === 0) {
      return {
        statusCode: 500,
        body: {
          status: false,
          message: 'Does not have any registered gateway or all gateways is deactivated',
        },
      }
    }

    for (let i = 0; i < quantityOfGatewaysInPriorityOrder; i++) {
      const gateway = gateways[i]
      const gatewayAdapter = gateway ? this.gateway(gateway.name) : null

      if (!gatewayAdapter) {
        return {
          statusCode: 500,
          body: {
            status: false,
            message: 'Gateway not found',
          },
        }
      }

      if (transaction.status === 'charged_back') {
        return {
          statusCode: 409,
          body: {
            status: false,
            message: 'Transaction already charged back',
          },
        }
      }

      const { body, statusCode } = await gatewayAdapter.refund(transaction.external_id)

      if (body.status) {
        await this.updateTransactionStatusAndProductQuantity(transaction.id)

        return {
          statusCode,
          body,
        }
      } else {
        if (i === quantityOfGatewaysInPriorityOrder - 1) {
          return {
            statusCode,
            body,
          }
        }
        continue
      }
    }

    return {
      statusCode: 500,
      body: {
        status: false,
        message: 'Erro ao realizar o reembolso',
      },
    }
  }

  async allTransaction(): Promise<Transaction[]> {
    return await Transaction.all()
  }

  async detailsOfTransaction(id: string): Promise<ServiceResponse<Transaction>> {
    if (!id) {
      return {
        statusCode: 400,
        body: {
          status: false,
          message: 'Id is required',
        },
      }
    }

    const transactions = await Transaction.query()
      .where('id', id)
      .preload('client', (clientQuery) => clientQuery.select('id', 'name', 'email'))
      .preload('product', (productQuery) => productQuery.select('id', 'name', 'price'))
      .preload('gateway', (gatewayQuery) => gatewayQuery.select('id', 'name'))

    if (!transactions[0]) {
      return {
        statusCode: 404,
        body: {
          status: false,
          message: 'No transaction found',
        },
      }
    }

    return {
      statusCode: 200,
      body: {
        status: true,
        data: transactions[0],
      },
    }
  }

  // Funções utilitárias para o service
  private async getGatewaysInPriorityOrder(): Promise<Gateway[]> {
    const gateways = await Gateway.query()
      .from('gateways')
      .where('is_active', true)
      .orderBy('priority', 'asc')

    return gateways
  }

  private async getOrCreateProductAndClientInformations(
    productName: string,
    clientData: { name: string; email: string }
  ): Promise<{ client: Client; product: Product | null }> {
    const trx = await db.transaction()
    try {
      let [product, client] = await Promise.all([
        trx
          .query<Product>()
          .select('id', 'amount', 'price')
          .from('products')
          .where('name', decodeURIComponent(productName))
          .first(),
        trx.query<Client>().select('id').from('clients').where('email', clientData.email).first(),
      ])

      if (!client) {
        const {
          body: { data },
        } = await this.clientService.createClients(clientData.email, clientData.name)
        client = data!
      }

      await trx.commit()
      return {
        product,
        client: client!,
      }
    } catch (error) {
      await trx.rollback()
      throw new Error(error.message)
    }
  }

  private async updateTransactionStatusAndProductQuantity(id: string) {
    const transaction = await Transaction.find(id)
    if (transaction) {
      transaction.status = 'charged_back'
      await transaction.save()
    }
    const product = await Product.find(transaction?.product_id)

    if (product && transaction) {
      product.amount += transaction.quantity
      await product.save()
    }
  }

  private gateway(gatewayname: string): PaymentGateway | null {
    return GatewayFactory.getGateway(gatewayname)
  }

  private async createTransactionValidator(
    product: Product | null,
    quantity: number
  ): Promise<ServiceResponse<null>> {
    if (!product) {
      return {
        statusCode: 404,
        body: {
          status: false,
          message: 'Product not found',
        },
      }
    }

    if (product.amount === 0) {
      return {
        statusCode: 409,
        body: {
          status: false,
          message: 'Product not available',
        },
      }
    }

    if (product.amount < quantity) {
      return {
        statusCode: 409,
        body: {
          status: false,
          message: 'Insufficient product for your request',
        },
      }
    }

    return {
      statusCode: 200,
      body: {
        status: true,
      },
    }
  }

  private async storeTransactionAndUpdateProduct(
    createDataTr: {
      clientId: string
      gatewayId: string
      externalId: string
      status: string
      amount: number
      cardLastNumber: string
      productId: string
      quantity: number
    },
    newAmount: number
  ) {
    const { amount, cardLastNumber, clientId, externalId, gatewayId, productId, quantity, status } =
      createDataTr

    const trx = await db.transaction()
    try {
      const [tr] = await Promise.all([
        trx
          .insertQuery<Transaction>()
          .table('transactions')
          .insert({
            amount: amount * 1000,
            card_last_numbers: Number.parseInt(cardLastNumber),
            client_id: clientId,
            created_at: new Date(Date.now()),
            external_id: externalId,
            gateway_id: gatewayId,
            id: v7(),
            product_id: productId,
            quantity,
            updated_at: new Date(Date.now()),
            status,
          }),
        trx.query().from('products').where('id', productId).update({ amount: newAmount }),
      ])
      await trx
        .insertQuery<TransactionsProduct>()
        .table('transactions_products')
        .insert({
          id: v7(),
          product_id: productId,
          quantity: quantity,
          transaction_id: tr[0].id,
          value: amount,
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
        })

      await trx.commit()
    } catch (error) {
      console.log(error.message)
      await trx.rollback()
    }
  }
}
