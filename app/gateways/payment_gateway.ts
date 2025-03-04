import { CreatePaymentInput, PaymentResponse } from '../../types/payment_adapter.js'
import { TransactionAdapterResponse } from '../../types/transactions.js'

export interface PaymentGateway {
  createTransaction(data: CreatePaymentInput): Promise<TransactionAdapterResponse<PaymentResponse>>
  listTransaction(): Promise<TransactionAdapterResponse<PaymentResponse[]>>
  refund(id: string): Promise<TransactionAdapterResponse<PaymentResponse>>
}
