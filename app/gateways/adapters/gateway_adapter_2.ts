import env from '#start/env'
import axios from 'axios'
import { CreatePaymentInput, PaymentResponse } from '../../../types/payment_adapter.js'
import { TransactionAdapterResponse } from '../../../types/transactions.js'
import { PaymentGateway } from '../payment_gateway.js'

export class Gateway2Adapter implements PaymentGateway {
  private base_url = env.get('BASE_URL_GATEWAY2')
  private headers = {
    'Gateway-Auth-Token': env.get('Gateway_Auth_Token'),
    'Gateway-Auth-Secret': env.get('Gateway_Auth_Secret'),
  }

  async createTransaction(
    datainput: CreatePaymentInput
  ): Promise<TransactionAdapterResponse<PaymentResponse>> {
    try {
      const { data } = await axios.post(
        `${this.base_url}/transacoes`,
        {
          valor: Math.abs(datainput.amount * 1000),
          nome: datainput.name,
          email: datainput.email,
          numeroCartao: datainput.cardNumber,
          cvv: datainput.cvv,
        },
        { headers: this.headers }
      )

      if (data.erros) {
        return {
          statusCode: data.statusCode,
          body: {
            status: false,
            message:
              data.erros[0].message === 'contate a central do seu cartão'
                ? 'Contact your credit card support'
                : data.erros[0].message,
          },
        }
      }

      return {
        statusCode: 200,
        body: {
          status: true,
          data: {
            id: data.id,
            amount: datainput.amount,
            card_first_digits: datainput.cardNumber.slice(0, 4),
            card_last_digits: datainput.cardNumber.slice(
              datainput.cardNumber.length - 4,
              datainput.cardNumber.length
            ),
            email: datainput.email,
            name: datainput.name,
            status: 'paid',
          },
        },
      }
    } catch (error) {
      console.log('error Gateway 2', error.message)
      console.log('error Gateway 2', error.response?.data)
      return {
        statusCode: error.response?.status || 500,
        body: {
          status: false,
          message:
            (error.message === 'contate a central do seu cartão'
              ? 'Contact your credit card support'
              : error.message) || 'Internal error',
          data:
            (error.response?.data?.error === 'contate a central do seu cartão'
              ? 'Contact your credit card support'
              : error.response?.data.error) || 'Internal error',
        },
      }
    }
  }
  async listTransaction(): Promise<TransactionAdapterResponse<PaymentResponse[]>> {
    try {
      const { data } = await axios.get(`${this.base_url}/transacoes`, { headers: this.headers })

      return {
        statusCode: 200,
        body: {
          status: true,
          data: data.data,
        },
      }
    } catch (error) {
      console.log(error.message)
      console.log(error.response.data)
      return {
        statusCode: error.response.status,
        body: {
          status: false,
          message: error.message,
          data: error.response.data,
        },
      }
    }
  }
  async refund(id: string): Promise<TransactionAdapterResponse<PaymentResponse>> {
    try {
      const { data } = await axios.post(
        `${this.base_url}/transacoes/reembolso`,
        { id },
        { headers: this.headers }
      )

      if (data.erros) {
        return {
          statusCode: data.statusCode,
          body: {
            status: false,
            message: data.erros[0].message,
          },
        }
      }

      return {
        statusCode: 200,
        body: {
          status: true,
          message: 'Refund successfully processed!',
        },
      }
    } catch (error) {
      console.log(error.message)
      console.log(error.response.data)
      return {
        statusCode: error.response.status,
        body: {
          status: false,
          message: error.message,
          data: error.response.data,
        },
      }
    }
  }
}
