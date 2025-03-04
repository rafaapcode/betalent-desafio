import User from '#models/user'
import { Bouncer } from '@adonisjs/bouncer'

export const crudUser = Bouncer.ability((user: User) => {
  return user.role === 'ADMIN' || user.role === 'MANAGER'
})

export const crudProduct = Bouncer.ability((user: User) => {
  return user.role === 'ADMIN' || user.role === 'MANAGER' || user.role === 'FINANCE'
})

export const refund = Bouncer.ability((user: User) => {
  return user.role === 'ADMIN' || user.role === 'FINANCE'
})
