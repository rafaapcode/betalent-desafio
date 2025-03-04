export type CreatePaymentInput = {
  amount: number
  name: string
  email: string
  cardNumber: string
  cvv: string
}

export type PaymentResponse = {
  id: string
  name: string
  email: string
  status: string
  card_first_digits: string
  card_last_digits: string
  amount: number
}
