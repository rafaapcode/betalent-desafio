export type TransactionAdapterResponse<T> = {
  statusCode: number
  body: {
    status: boolean
    data?: T
    message?: string
  }
}

export type BuyProductType = {
  name: string
  email: string
  cardNumber: string
  cvv: string
  productName: string
  quantity: number
}
