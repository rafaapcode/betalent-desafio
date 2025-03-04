import User from '#models/user'
import { v7 } from 'uuid'
import { ServiceResponse } from '../../types/response.js'

export default class UserService {
  async verifyUser(email: string, password: string): Promise<User> {
    const user = await User.verifyCredentials(email, password)

    return user
  }

  async createUser(userData: {
    email: string
    password: string
    role: 'ADMIN' | 'MANAGER' | 'FINANCE' | 'USER'
  }): Promise<ServiceResponse<User>> {
    const userExits = await User.findBy('email', userData.email)

    if (userExits) {
      return {
        statusCode: 400,
        body: {
          message: 'User already exists',
          status: false,
        },
      }
    }

    const user = await User.create({
      id: v7(),
      email: userData.email,
      password: userData.password,
      role: userData.role,
    })

    return {
      statusCode: 201,
      body: {
        status: true,
        data: user,
        message: 'user created successfully',
      },
    }
  }

  async updateUser(
    email: string,
    userData: {
      email?: string | undefined
      password?: string | undefined
      role?: 'ADMIN' | 'MANAGER' | 'FINANCE' | 'USER' | undefined
    }
  ): Promise<ServiceResponse<User>> {
    const user = await User.findBy('email', email)

    if (!user) {
      return {
        body: {
          status: false,
          message: 'User not found',
        },
        statusCode: 404,
      }
    }

    user.email = userData?.email ? userData?.email : user.email
    user.password = userData?.password ? userData?.password : user.password
    user.role = userData?.role ? userData?.role : user.role

    await user.save()

    return {
      body: {
        message: 'User updated successfully',
        status: true,
      },
      statusCode: 200,
    }
  }

  async deleteUser(email: string): Promise<ServiceResponse<User>> {
    const user = await User.findBy('email', email)

    if (!user) {
      return {
        body: {
          message: 'User not found',
          status: false,
        },
        statusCode: 404,
      }
    }

    await user.delete()

    return {
      statusCode: 200,
      body: {
        message: 'User deleted successfully',
        status: true,
      },
    }
  }

  async getUser(filterParam: string): Promise<ServiceResponse<User>> {
    if (!filterParam) {
      return { statusCode: 400, body: { message: 'Get user by email or id', status: false } }
    }

    const user = await User.query().where('email', filterParam).orWhere('id', filterParam).first()

    if (!user) {
      return { statusCode: 404, body: { message: 'User not found', status: false } }
    }

    return {
      statusCode: 200,
      body: {
        data: user,
        status: true,
      },
    }
  }

  async getAllUser() {
    const user = await User.all()

    return {
      user,
    }
  }
}
