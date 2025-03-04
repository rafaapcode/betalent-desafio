import ProductService from '#services/product_service'
import { createProductValidator, updateProductValidator } from '#validators/product'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ProductsController {
  constructor(protected productService: ProductService) {}

  async createProduct({ request, response }: HttpContext) {
    const data = request.all()

    const { name, amount, price, description } = await createProductValidator.validate(data)

    const { body, statusCode } = await this.productService.createProduct({
      name,
      amount,
      description,
      price,
    })

    return response.status(statusCode).json(body)
  }
  async getProduct({ request, response }: HttpContext) {
    const id = request.param('id')

    const { body, statusCode } = await this.productService.getProduct(id)

    return response.status(statusCode).json(body)
  }
  async deleteProduct({ request, response }: HttpContext) {
    const id = request.param('id')

    const { body, statusCode } = await this.productService.deleteProduct(id)

    return response.status(statusCode).json(body)
  }
  async updateProduct({ request, response }: HttpContext) {
    const id = request.param('id')

    const data = request.all()

    const newProductData = await updateProductValidator.validate(data)

    const { body, statusCode } = await this.productService.updateProduct(id, newProductData)

    return response.status(statusCode).json(body)
  }
  async getAllProduct() {
    return await this.productService.getAllProduct()
  }
}
