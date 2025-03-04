export type ServiceResponse<T> = {
  statusCode: number
  body: {
    status: boolean
    data?: T
    message?: string
  }
}
