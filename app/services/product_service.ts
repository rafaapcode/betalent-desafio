import Product from '#models/product'
import { DateTime } from 'luxon'
import { v7 } from 'uuid'
import { ServiceResponse } from '../../types/response.js'

export default class ProductService {
  async createProduct(dataProduct: {
    name: string
    amount: number
    description: string
    price: number
  }): Promise<ServiceResponse<Product>> {
    const productExists = await Product.findBy('name', dataProduct.name)

    if (productExists && !productExists.deleted_at) {
      return {
        statusCode: 400,
        body: { message: 'Product already exist', status: false },
      }
    }

    if (!productExists) {
      const product = await Product.create({
        id: v7(),
        name: dataProduct.name,
        amount: dataProduct.amount,
        description: dataProduct.description,
        price: dataProduct.price,
      })

      return {
        statusCode: 201,
        body: {
          data: product,
          status: true,
        },
      }
    }

    productExists.deleted_at = null
    productExists.name = dataProduct.name
    productExists.amount = dataProduct.amount
    productExists.description = dataProduct.description
    productExists.price = dataProduct.price

    await productExists.save()

    return {
      statusCode: 201,
      body: {
        data: productExists,
        status: true,
      },
    }
  }
  async getProduct(id: string): Promise<ServiceResponse<Product>> {
    if (!id) {
      return {
        statusCode: 400,
        body: { message: 'Id is required', status: false },
      }
    }

    const product = await Product.find(id)

    if (!product || product.deleted_at) {
      return {
        statusCode: 404,
        body: { message: 'Product not found', status: false },
      }
    }

    return {
      statusCode: 200,
      body: {
        data: product,
        status: true,
      },
    }
  }
  async deleteProduct(id: string): Promise<ServiceResponse<Product>> {
    if (!id) {
      return {
        statusCode: 400,
        body: { message: 'Id is required', status: false },
      }
    }

    const product = await Product.find(id)

    if (!product) {
      return {
        statusCode: 404,
        body: { message: 'Product not found', status: false },
      }
    }

    product.deleted_at = DateTime.local()

    await product.save()

    return {
      statusCode: 200,
      body: {
        message: 'Product deleted with succesfully',
        status: true,
      },
    }
  }
  async updateProduct(
    id: string,
    newProductData: { name?: string; amount?: number; price?: number; description?: string }
  ): Promise<ServiceResponse<Product>> {
    if (!id) {
      return {
        statusCode: 400,
        body: { message: 'Id is required', status: false },
      }
    }

    const product = await Product.find(id)

    if (!product || product.deleted_at) {
      return {
        statusCode: 404,
        body: { message: 'Product not found', status: false },
      }
    }

    product.name = newProductData.name ? newProductData.name : product.name
    product.amount = newProductData.amount ? newProductData.amount : product.amount
    product.price = newProductData.price ? newProductData.price : product.price
    product.description = newProductData.description
      ? newProductData.description
      : product.description

    await product.save()

    return {
      statusCode: 200,
      body: {
        message: 'Product updated with succesfully',
        status: true,
        data: product,
      },
    }
  }
  async getAllProduct() {
    const product = await Product.query()
      .select('id', 'name', 'amount', 'price', 'description', 'created_at', 'updated_at')
      .orderBy('name')
      .whereNull('deleted_at')

    return {
      product,
    }
  }
}
