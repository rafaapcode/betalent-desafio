import TransactionService from '#services/transaction_service'
import { createTransactionValidator } from '#validators/transaction'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class TransactionsController {
  constructor(protected transactionService: TransactionService) {}

  async getAllTransaction() {
    return await this.transactionService.allTransaction()
  }

  async getDetailsOfTransaction({ request, response }: HttpContext) {
    const id = request.param('id')

    const { body, statusCode } = await this.transactionService.detailsOfTransaction(id)
    return response.status(statusCode).json(body)
  }

  async createTransaction({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const validateData = await createTransactionValidator.validate(data)

      const { body, statusCode } = await this.transactionService.createTransaction(validateData)
      return response.status(statusCode).json(body)
    } catch (error) {
      if (error.code === 'E_VALIDATION_ERROR') {
        return response.status(error.status).json({ message: error.messages })
      }
      return response.status(500).json({ message: error.message })
    }
  }

  async refundTransaction({ request, response }: HttpContext) {
    const id = request.param('id')

    const { body, statusCode } = await this.transactionService.refund(id)
    return response.status(statusCode).json(body)
  }
}
