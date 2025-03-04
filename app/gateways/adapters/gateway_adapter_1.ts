import env from '#start/env'
import axios from 'axios'
import { CreatePaymentInput, PaymentResponse } from '../../../types/payment_adapter.js'
import { TransactionAdapterResponse } from '../../../types/transactions.js'
import { PaymentGateway } from '../payment_gateway.js'

export class Gateway1Adapter implements PaymentGateway {
  private base_url = `${env.get('BASE_URL_GATEWAY1')}`
  private login_payload = {
    email: env.get('EMAIL_GATEWAY1_LOGIN'),
    token: env.get('TOKEN_GATEWAY1_LOGIN'),
  }

  async createTransaction(
    datainput: CreatePaymentInput
  ): Promise<TransactionAdapterResponse<PaymentResponse>> {
    try {
      const { body, statusCode } = await this.login()

      if (!body.status) {
        return {
          statusCode: statusCode,
          body: {
            status: false,
            message: body.message,
          },
        }
      }
      const { data } = await axios.post(`${this.base_url}/transactions`, datainput, {
        headers: { Authorization: `Bearer ${body.data}` },
      })
      return {
        statusCode: 200,
        body: {
          status: true,
          data: {
            id: data.id,
            amount: datainput.amount * 1000,
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
    } catch (error: any) {
      console.log('error Gateway 1', error.message)
      console.log('error Gateway 1', error.response?.data)
      return {
        statusCode: error.response?.status || 500,
        body: {
          status: false,
          message: error.message || 'Internal error',
          data: error.response?.data || 'Internal error',
        },
      }
    }
  }
  async listTransaction(): Promise<TransactionAdapterResponse<PaymentResponse[]>> {
    try {
      const { body, statusCode } = await this.login()

      if (!body.status) {
        return {
          statusCode: statusCode,
          body: {
            status: false,
            message: body.message,
          },
        }
      }

      const { data } = await axios.get(`${this.base_url}/transactions`, {
        headers: { Authorization: `Bearer ${body.data}` },
      })

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
      const { body, statusCode } = await this.login()

      if (!body.status) {
        return {
          statusCode: statusCode,
          body: {
            status: false,
            message: body.message,
          },
        }
      }

      const { data } = await axios.post(`${this.base_url}/transactions/${id}/charge_back`, null, {
        headers: { Authorization: `Bearer ${body.data}` },
      })

      if (data.error) {
        return {
          statusCode: data.statusCode,
          body: {
            status: false,
            message: data.error,
          },
        }
      }

      return {
        statusCode: 200,
        body: {
          status: true,
          data: {
            amount: data.amount,
            card_first_digits: data.card_first_digits,
            card_last_digits: data.card_last_digits,
            email: data.email,
            id: data.id,
            name: data.name,
            status: data.status,
          },
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
  private async login(): Promise<TransactionAdapterResponse<string>> {
    try {
      const { data } = await axios.post(`${this.base_url}/login`, this.login_payload)
      return {
        statusCode: 200,
        body: {
          status: true,
          data: data.token,
        },
      }
    } catch (error: any) {
      console.log('Error Gateway 1', error.response.data)
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
